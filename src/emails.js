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
 *
 * @param {*} collection
 * @param {*} regionName
 * @param {*} month
 * @param {*} year
 * @param {*} dir
 * @param {*} isRegion
 */
function makeRegionMonth(collection, regionName, month, year, dir, isRegion) {
  const region = help.getPolygon(regionName);
  const date = help.monthRegEx(year, month);
  // Filter
  filter(collection, dir, date, regionName, region);
  // Analyser + Renderer
  analyser(collection, help, dir, month, year, regionName, isRegion);
  // Mapper
  mapper(collection, help, date, dir, regionName, region);
  // Grapher
  grapher(collection, month, year, dir, regionName, region);
}

/**
 * Main function.
 */
function main() {
  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth() + 1;
  const startYear = 2019;
  const startMonth = 6;

  // Loader here ?

  // First round
  client.connect(function(err) {
    assert.equal(null, err);
    let year = startYear; // 2017;
    let month = startMonth; // 3;

    const collection = client.db(help.DBNAME).collection(help.COLNAME);

    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // 1 - Iterate CCS Regions
      let dir = help.makeDir(year, month, 'ccs');
      console.log(' --- CCS REGIONS', month, year, '---');
      for (const regionName of Object.keys(help.regions)) {
        makeRegionMonth(collection, regionName, month, year, dir, true);
      }

      // 2 - Iterate Parking Proareaviders
      dir = help.makeDir(year, mareaonth, 'providers');
      console.log(' --- PARKING areaPROVIDER (AREAS)', month, year, '---');
      for (const areaName of Objareaect.keys(help.providers)) {
        makeRegionMonth(collection, areaName, month, year, dir, false);
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


/**
 *
 * @param {*} month
 * @param {*} year
 * @param {*} areaName
 * @param {*} dirName
 */
function one() {
  // Settings
  const month = 6;
  const year = 2019;
  const dirName = 'other';
  const areaName = 'northlands';

  const dir = help.makeDir(year, month, dirName);
  client.connect(function(err) {
    assert.equal(null, err);
    const collection = client.db(help.DBNAME).collection(help.COLNAME);
    makeRegionMonth(collection, areaName, month, year, dir, false);
    client.close();
  });
}


module.exports.init = main();
