/**
 * Data Filter. Pulls data from database and filters by 
 * month and CCS region.
 * 
 * Author: Peter JP Scriven
 * Started: 13 Feb 2019
 * Updated: 6 Apr 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const Helper = require('./helper.js')

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, { useNewUrlParser: true });

//FUNCTIONS
// Callback function wrapper
function saveCSVCallback(year, month, region) {

  return function(err, data) {
    assert.equal(err,null);
    console.log("---", year, help.months[month-1], region, ':', data.length, "---");
    var dir = help.makeDir(year, month);
    saveCSV(path.join(dir,'csv',region+'.csv'), data); // Write file
  }
}

// Save data to CSV file
function saveCSV(file, data) {

  var writeData = '';

  if (data.length > 0) {
    writeData = "report_id, " +
                "latitude, " +
                "longitude, " +
                "address, " +
                "report_state, " +
                "datetime_of_misuse, " +
                "photo_urls, " +
                "abuse_type, " +
                "other, " +
                "permit_number, " +
                "number_plate, " +
                "public_private, " +
                "park_owner, " +
                "additional_details\n";
    
    for (let i in data) {
      var report = data[i];

      // Main data
      writeData += report.id + ',';
      writeData += report.location.latitude + ',';
      writeData += report.location.longitude + ',';
      writeData += '"'+report.address+'"' + ',';
      writeData += report.report_state_name + ','; // alt: report.report_state_id

      // Field Value Variables
      var datetime_of_misuse = '';
      var photo_urls = [];
      var abuse_type = '';
      var other = '';
      var permit_number = '';
      var number_plate = '';
      var public_private = '';
      var park_owner = '';
      var additional_details = '';

      // Get Values
      for (let field of report.form_fields) {
        // var field = report.form_fields[j];

        switch (field.id) {
          case 24489:
            datetime_of_misuse = field.value;
            break;
          case 41289: //TODO: Iterate items
            var photoArray = field.value;
            for (let k in photoArray) {
              photo_urls.push(photoArray[k].original_url);
            }
            break;
          case 24529:
            var abuseTypes = {'f_4125_74_17_76_10': 'No Permit',
                              'f_4125_74_17_78_11': 'Permit expired',
                              'f_4125_74_17_175_14': 'Other'}
            if (field.value in abuseTypes) {
              abuse_type = abuseTypes[field.value];
            } else {
              if (field.value) {
                console.error("Error Abuse Type value:",field.value);
              }
              abuse_type = '';
            }
            break;
          case 24536:
            other = (field.value ? '"'+field.value+'"' : '');
            break;
          case 24534:
            permit_number = (field.value ? '"'+field.value+'"' : '');
            break;
          case 24500:
            number_plate = (field.value ? '"'+field.value.toUpperCase()+'"' : '');
            break;
          case 37191:
            var ppOptions = {'f_4125_159_22_159_1': 'Public',
                             'f_4125_159_22_161_2': 'Private',
                             'f_4125_159_22_163_3': 'Not sure'}
            if (field.value in ppOptions) {
              public_private = ppOptions[field.value];
            } else {
              if (field.value) {
                console.error("Error translating Public/Private Field. value:",field.value);
              }
              public_private = '';
            }
            break;
          case 55424:
            park_owner = (field.value ? '"'+field.value+'"' : '');
            break;
          case 41744:
            additional_details = (field.value ? '"'+field.value+'"' : '');
            break;
          // Follow up, Office use, Section, Textbox, Textbox
          case 65244: case 65245: case 63982: case 24499: case 24491:
            // Catch all other known fields here
            break;
          // New fields: 'Action', Partner Action box
          case 77635: case 77636:
            break;
          default:
            // Log weird fields
            console.log("Found a weird form field! Report", report.id, 'with field ID:', field.id);
            break;
        }
      }

      // Collate Values
      writeData += datetime_of_misuse + ', ';
      writeData += (photo_urls.length ? '"'+photo_urls+ '"' : '') + ', ';
      writeData += abuse_type + ', ';
      writeData += other + ', ';
      writeData += permit_number + ', ';
      writeData += number_plate + ', ';
      writeData += public_private + ', ';
      writeData += park_owner + ', ';
      writeData += additional_details + ', ';
      writeData += '\n';
    }
  }
  
  fs.writeFile(file, writeData, null, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// Pull the data from the database filtered by month and ccs region
function main() {
  
  client.connect(function(err) {
    
    assert.equal(null, err);
    
    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);
    
    var currYear = new Date().getFullYear();
    var currMonth = new Date().getMonth() + 1;
    
    var year = 2018; //2017;
    var month = 8;  //3;
    
    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // Iterate Regions
      for (let key of Object.keys(help.regions)) {

        var query = {
          "location": {
            "$geoWithin": {
              "$polygon": help.regions[key]
            }
          },
          "form_fields": {
            "$elemMatch": {
              "value": help.monthRegEx(year, month)
            }
          }
        }

        collection.find(query).toArray(saveCSVCallback(year, month, key));
      }
      
      // Next Month
      if (month < 12) { 
        month++; 
      } else { 
        year++; 
        month = 1; 
      }
    }

    client.close()
  });
}

main();
