#!/usr/bin/env node
/**
 * Generate regional monthly report emails.
 *
 * Author: Peter JP Scriven
 * Started: 26 Jul 2019
 */

// IMPORTS
// Global
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
// Local
const filter = require('./generators/filter.js');
const analyser = require('./generators/analyser.js');
const mapper = require('./generators/mapper.js');
const grapher = require('./generators/grapher.js');
// const renderer = require('./generators/renderer.js');
const Helper = require('./helper.js');

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, {useNewUrlParser: true});

/**
 * Main function.
 */
function main() {
  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth() + 1;
  const startYear = 2019;
  const startMonth = 2;

  // Loader here ?

  // First round
  client.connect(function(err) {
    assert.equal(null, err);
    let year = startYear; // 2017;
    let month = startMonth; // 3;

    const collection = client.db(help.DBNAME).collection(help.COLNAME);

    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      const date = help.monthRegEx(year, month);
      // 1 - Iterate CCS Regions
      console.log(' --- CCS REGIONS', month, year, '---');
      for (const regionName of Object.keys(help.regions)) {
        // Get Dir
        const dir = help.makeDir(year, month, true);
        const region = help.regions[regionName];
        // Filter
        filter(collection, dir, date, regionName, region);
        // Analyser + Renderer
        analyser(collection, help, month, year, regionName, true);
        // Mapper
        mapper(collection, help, date, dir, regionName, region);
        // Grapher
        grapher(collection, month, year, dir, regionName, region);
      }
      // 2 - Iterate Parking Providers
      console.log(' --- PARKING PROVIDER (AREAS)', month, year, '---');
      for (const areaName of Object.keys(help.providers)) {
        // Get Dir
        const dir = help.makeDir(year, month, false);
        const area = help.providers[areaName];
        // Filter
        filter(collection, dir, date, areaName, area);
        // Analyser + Renderer
        analyser(collection, help, month, year, areaName, false);
        // Mapper
        mapper(collection, help, date, dir, areaName, area);
        // Grapher
        grapher(collection, month, year, dir, areaName, area);
      }
      // Next Month
      if (month < 12) {
        month++;
      } else {
        month = 1; year++;
      }
    }
    client.close();
  });
}

module.exports.init = main();
