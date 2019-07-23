/**
 * Just do everything.
 */
// IMPORTS
const filter   = require('filter.js');
const analyser = require('analyser.js');
const mapper   = require('mapper.js');
const grapher  = require('grapher.js');
const renderer = require('renderer.js');

const fs = require('fs');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

// CONSTANTS
// Database
const URL = 'mongodb://localhost:27017';
const DBNAME = 'accessaware';
const COLNAME = 'abuses3';
// Output
const OUTPUT_DIR = process.cwd();


function main() {
  client.connect(function(err) {
    assert.equal(null, err);
    
    const db = client.db(DBNAME);
    const col = db.collection(COLNAME);
    
    var year = 2019; // 2017;
    var month = 2; // 3;
    
    var currYear = new Date().getFullYear();
    var currMonth = new Date().getMonth() + 1;
    
    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {

      var dir = makeDir(year, month);
      
      // Iterate Regions
      for (let region of Object.keys(regions)) {
      
        // Filter


        // Analyser


        // Mapper


        // Grapher


        // Renderer


      }
    }
  client.close();
  });
}

main()
