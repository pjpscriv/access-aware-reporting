/**
 * The Graphing Module to draw graphs.
 * 
 * Author: Peter JP Scriven
 * Started: 17 Mar 2019
 * Updated: 6 Apr 2016
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const plotly = require('plotly')("accessaware", "gvctlNfABdbXkh1No40E")
const Helper = require('./helper.js')
const MongoClient = require('mongodb').MongoClient;

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, { useNewUrlParser: true });

// FUNCTIONS
// Get # reports per day from Database
function getDayCounts(col, year, month, region, callback) {
  
  var results = {};

  // Iterate Days
  var monthDays = help.daysInMonth(year, month);
  for (var i=1; i<=monthDays; i++) {
    col.find({
      "location": {
        "$geoWithin": {
          "$polygon": help.regions[region]
        }
      },
      "form_fields": {
        "$elemMatch": {
          "id": 24489,
          "value": help.dayRegEx(year, month, i)
        }
      },
      "report_state_name": { 
        "$ne": "Report rejected"
        // "$nin": [ "Report rejected", "Stored" ] 
      }
    },
    { "projection": { 
      "_id": 0,
      "location": 1 
      }
    }).toArray(makeCallback(i, monthDays));
      
    function makeCallback(day, length) {
      return (err, data) => {
        if (err) {
          console.log(err);
        } else {
          results[day] = data.length;
          if (Object.keys(results).length >= length) {
            callback(results);
          }
        }
      }
    }
  }
}

// Graph individual graph
function drawGraph(collection, month, year, region) {

  const OUT_FILE = path.join(help.makeDir(year, month),'graph',region + '_graph.png');

  getDayCounts(collection, year, month, region, (results) => {

    console.log(' ---', region, month, year, '---')
    console.log(results)

    var dates = Object.keys(results);
    var values = [];
    for (let i of dates) {
      values.push(results[i])
    }

    var data = {
      x: dates,
      y: values,
      type: "bar",
      text: values,
      textposition: "auto"
    };

    var layout = {
      xaxis: {
        title: 'Day of the Month',
        // autotick: false,
        // ticks: "outside",
        // tick0: 0,
        dtick: 1,
        // ticklen: 8,
        // tickwidth: 4,
        // tickcolor: "#000"
      },
      yaxis: {
        title: 'Number of Reports',
      }
    }

    var figure = { 'data': [data], layout: layout };

    var options = {
        format: 'png',
        width: 800,
        height: 400
    };

    plotly.getImage(figure, options, function (err, image) {
        if (err) return console.log (err);
  
        var file = fs.createWriteStream(OUT_FILE);
        image.pipe(file);
        console.log('Rendering', OUT_FILE);
    });
  });
}

// Main: Iterator
function main() {
  client.connect(function(err) {
    assert.equal(null, err);

    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);
    
    var year = 2018;
    var month = 12;

    var currYear = new Date().getFullYear();
    var currMonth = new Date().getMonth() + 1;
    
    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // Iterate Regions
      for (let region of Object.keys(help.regions)) {
        drawGraph(collection, month, year, region);
      }
      
      if (month < 12) { month++; }
      else { month = 1; year++; }
    }

    client.close()
  });
}

main();
