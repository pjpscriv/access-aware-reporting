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
const Helper = require('./helper.js');

/**
 * CONSTRUCTOR
 */
function EmailMaker() {
  this.help = new Helper();
  this.client = new MongoClient(this.help.URL, {useNewUrlParser: true});
}


/**
 *
 * @param {*} collection
 * @param {*} regionName
 * @param {*} month
 * @param {*} year
 * @param {*} dir
 * @param {*} isRegion
 */
EmailMaker.prototype.makeRegionMonth =function(
    collection, regionName, month, year, dir, isRegion) {
  const region = this.help.getPolygon(regionName);
  const date = this.help.monthRegEx(year, month);
  // Filter
  filter(collection, dir, date, regionName, region);
  // Analyser + Renderer
  analyser(collection, this.help, dir, month, year, regionName, isRegion);
  // Mapper
  mapper(collection, this.help, date, dir, regionName, region);
  // Grapher
  grapher(collection, month, year, dir, regionName, region);
};

/**
 * Main function.
 */
EmailMaker.prototype.main = function() {
  // Point to generate emails from
  const startMonth = 10; // 3
  const startYear = 2017; // 2017

  const that = this;

  this.client.connect(function(err) {
    assert.equal(null, err);
    let year = startYear;
    let month = startMonth;
    const currMonth = new Date().getMonth() + 1;
    const currYear = new Date().getFullYear();

    const collection = that.client.db(that.help.DBNAME)
        .collection(that.help.COLNAME);

    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // 1 - Iterate CCS Regions
      let dir = that.help.makeDir(year, month, 'ccs');
      console.log(' --- CCS REGIONS', month, year, '---');
      for (const regionName of Object.keys(that.help.regions)) {
        that.makeRegionMonth(collection, regionName, month, year, dir, true);
      }

      // 2 - Iterate Parking Providers
      dir = that.help.makeDir(year, month, 'providers');
      console.log(' --- PARKING PROVIDER (AREAS)', month, year, '---');
      for (const areaName of Object.keys(that.help.providers)) {
        that.makeRegionMonth(collection, areaName, month, year, dir, false);
      }

      // Next Month
      if (month < 12) {
        month++;
      } else {
        month = 1; year++;
      }
    }
    that.client.close();
  });
};

/**
 * @param {int} month
 * @param {int} year
 * @param {string} dirName
 * @param {string} areaName
 */
EmailMaker.prototype.oneEmail = function(month, year, dirName, areaName) {
  const that = this;
  const dir = this.help.makeDir(year, month, dirName);

  this.client.connect(function(err) {
    assert.equal(null, err);
    const collection = that.client.db(that.help.DBNAME)
        .collection(that.help.COLNAME);
    that.makeRegionMonth(collection, areaName, month, year, dir, false);
    client.close();
  });
};


module.exports = EmailMaker;

// If run from command line
if (require.main === module) {
  new EmailMaker().main();
}
