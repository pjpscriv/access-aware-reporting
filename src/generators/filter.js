/**
 * Data Filter. Pulls data from database and filters by
 * month and CCS region.
 *
 * Author: Peter JP Scriven
 * Started: 13 Feb 2019
 * Updated: 26 Jul 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// FUNCTIONS
/**
 * Convert JSON data to CSV and save to file.
 *
 * @param {path} file Path to output file
 * @param {json} data Data to write to file
 */
function saveCSV(file, data) {
  let writeData = '';

  if (data.length > 0) {
    // Headers
    writeData = 'report_id, ' +
                'latitude, ' +
                'longitude, ' +
                'address, ' +
                'report_state, ' +
                'datetime_of_misuse, ' +
                'photo_urls, ' +
                'abuse_type, ' +
                'other, ' +
                'permit_number, ' +
                'number_plate, ' +
                'public_private, ' +
                'park_owner, ' +
                'additional_details\n';

    for (const i in data) {
      if ({}.hasOwnProperty.call(data, i)) {
        const report = data[i];

        // Main data
        writeData += report.id + ',';
        writeData += report.location.latitude + ',';
        writeData += report.location.longitude + ',';
        writeData += '\"'+report.address+'\"' + ',';
        writeData += report.report_state_name + ','; // or .report_state_id

        // Field Value Variables
        let datetimeOfMisuse = '';
        const photoUrls = [];
        let abuseType = '';
        let other = '';
        let permitNumber = '';
        let numberPlate = '';
        let publicPrivate = '';
        let parkOwner = '';
        let additionalDetails = '';

        // Get Values
        for (const field of report.form_fields) {
          // let field = report.form_fields[j];

          switch (field.id) {
            case 24489:
              datetimeOfMisuse = field.value;
              break;
            case 41289: // TODO: Iterate items
              const photoArray = field.value;
              for (const k in photoArray) {
                if ({}.hasOwnProperty.call(photoArray, k)) {
                  photoUrls.push(photoArray[k].original_url);
                }
              }
              break;
            case 24529:
              // what is? f_4125_74_17_120_12
              const abuseTypes = {
                'f_4125_74_17_76_10': 'No Permit',
                'f_4125_74_17_78_11': 'Permit expired',
                'f_4125_74_17_175_14': 'Other'};
              if (field.value in abuseTypes) {
                abuseType = abuseTypes[field.value];
              } else {
                if (field.value) {
                  console.error('Error Abuse Type value:', field.value);
                  console.error('In Report:', report.id);
                }
                abuseType = '';
              }
              break;
            case 24536:
              other = (field.value ? '\"'+field.value+'\"' : '');
              break;
            case 24534:
              permitNumber = (field.value ? '\"'+field.value+'\"' : '');
              break;
            case 24500:
              numberPlate = (field.value ? '\"'+field.value.toUpperCase()+'\"'
               : '');
              break;
            case 37191:
              const ppOptions = {
                'f_4125_159_22_159_1': 'Public',
                'f_4125_159_22_161_2': 'Private',
                'f_4125_159_22_163_3': 'Not sure'};
              if (field.value in ppOptions) {
                publicPrivate = ppOptions[field.value];
              } else {
                if (field.value) {
                  console.error(
                      'Error translating Public/Private Field. value:',
                      field.value);
                  console.error('In Report:', report.id);
                }
                publicPrivate = '';
              }
              break;
            case 55424:
              parkOwner = (field.value ? '\"'+field.value+'\"' : '');
              break;
            case 41744:
              additionalDetails = (field.value ? '\"'+field.value+'\"' : '');
              break;
            // Follow up, Office use, Section, Textbox, Textbox
            case 65244: case 65245: case 63982: case 24499: case 24491:
            // SectionBreak
            case 24504:
              // Catch all other known fields here
              break;
            // New fields: 'Action', Partner Action box, another thing
            case 77635: case 77636: case 107950:
              break;
            default:
              // Log weird fields
              console.log('Found a weird form field! Report', report.id,
                  'with field ID:', field.id);
              break;
          }
        }

        // Collate Values
        writeData += datetimeOfMisuse + ', ';
        writeData += (photoUrls.length ? '\"'+photoUrls+ '\"' : '') + ', ';
        writeData += abuseType + ', ';
        writeData += other + ', ';
        writeData += permitNumber + ', ';
        writeData += numberPlate + ', ';
        writeData += publicPrivate + ', ';
        writeData += parkOwner + ', ';
        writeData += additionalDetails + ', \n';
      }
    }
  }

  fs.writeFile(file, writeData, null, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(file);
  });
}

/**
 * Callback function wrapper
 *
 * @param {object} dir Folder in which the file is created
 * @param {object} region Used to name the csv file
 * @return {function} A callback that takes json data and writes it to the file
 */
function saveCSVCallback(dir, region) {
  return function(err, data) {
    assert.equal(err, null);
    // Write to file
    saveCSV(path.join(dir, 'csv', region+'.csv'), data);
  };
}

/**
 * Pull the data from the database filtered by month and ccs region
 *
 * @param {*} collection
 * @param {*} dir
 * @param {RegExp} date The month
 * @param {string} regionName
 * @param {string} region
 */
function main(collection, dir, date, regionName, region) {
  const query = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    'form_fields': {
      '$elemMatch': {
        'value': date,
      },
    },
  };

  collection.find(query).toArray(saveCSVCallback(dir, regionName));
}

module.exports = main;
