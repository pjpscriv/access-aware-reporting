/**
 * Mapping Module. Draws a .png map of points for
 * a given region and month. Also draws the outline
 * of the region.
 * 
 * Author: Peter JP Scriven
 * Started: 17 Mar 2019
 * Updated: 6 Apr 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const StaticMaps = require('staticmaps');
const Helper = require('./helper.js');
const MongoClient = require('mongodb').MongoClient;

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, { useNewUrlParser: true });

// FUNCTIONS
// Region outline converter
function createPolyline(region) {
  var arr = [];
  for (var i=0; i<region.length; i++) {
    var point = [region[i][1], 
                 region[i][0]]
    arr.push(point);
  }
  return { coords: arr, color: '#333333BB', width: 3 };
}

// Get the points
function getValidReports(col, year, month, region, callback) {

  var outFile = path.join(help.makeDir(year, month), 'map',region + '_map.png');

  col
    .find({
      "location": {
        "$geoWithin": {
          "$polygon": help.regions[region]
        }
      },
      "form_fields": {
        "$elemMatch": {
          "id": 24489,
          "value": help.monthRegEx(year, month)
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
    }).toArray((err, data) => {
      if (err) {
        console.log('Mongo err:',err);
      } else {
        console.log("---", year, help.months[month-1], region, ':', data.length, "---");
        callback(data, region, outFile)
      }
    });
}

// Draw Individual Map
function drawPointMap(points, region, file) {

  // Create Map
  const options = {
    width: 800,
    height: 400,
    tileUrl: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
  };
  var map = new StaticMaps(options);

  // Make Marker
  const marker = {
    img: help.ICON_FILE,
    width: 1,
    height: 1,
    offsetX: 16,
    offsetY: 16
  };
  
  // Add Markers to Map
  for (var i=0; i<points.length; i++) {
    var point = points[i].location;
    var long = point.longitude;
    var lat = point.latitude;
    marker.coord = [long,lat];

    map.addMarker(marker);
  }

  // Add Region Outline
  map.addLine(createPolyline(help.regions[region]));

  // Render
  map.render() //zoom=8
    .then(() => map.image.save(file))
    .then(() => {console.log('Rendered', file)})
    .catch(function(err) { console.log(err); });
}

// Main: Month / Region Iterator
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
        getValidReports(collection, year, month, region, drawPointMap);
      }
      if (month < 12) { month++; }
      else { month = 1; year++; }
    }

    client.close()
  });
}

function test() {
  client.connect(function(err) {
    assert.equal(null, err);

    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);
    
    var year = 2019;
    var month = 3;
    var region = 'midlands';

    getValidReports(collection, year, month, region, drawPointMap);

    client.close()
  });
}

// test();
main();
