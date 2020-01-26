#!/usr/bin/env node
/**
 * Generate regional monthly report emails.
 *
 * Author: Peter JP Scriven
 * Started: 26 Jul 2019
 */

// IMPORTS
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
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
 * Generate csv, json, map, graph & html for one region over one month.
 *
 * @param {*} collection MongoDB collection.
 * @param {string} regionName Name of area e.g. 'northen'.
 * @param {int} month Month. Range 1-12.
 * @param {int} year Year e.g. 2018
 * @param {path} dir Directory to which files are written.
 * @param {boolean} isRegion If an area is an official CCS region.
 */
EmailMaker.prototype.makeRegionMonth = function(collection, regionName, month,
    year, dir, isRegion) {
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
 * Main function. Generates emails for all CCS regions and parking provider
 * areas from a given (startMonth, starYear) til the present month.
 *
 * Earliest (month,year) is (3, 2017)
 *
 * @param {int} startMonth 1-12
 * @param {int} startYear Earliest year: 2017
 */
EmailMaker.prototype.main = function(startMonth, startYear) {
  // Error Check
  if (startYear < 2017 || startYear === 2017 && startMonth < 3) {
    const dateStr = this.help.monthsLong[startMonth]+' '+String(startYear);
    throw Error(dateStr+' too early. Earliest start date March 2017.');
  }
  const that = this;

  this.client.connect(function(err) {
    assert.equal(null, err);
    let year = startYear;
    let month = startMonth;
    const currMonth = new Date().getMonth() + 1;
    const currYear = new Date().getFullYear();
    const col = that.client.db(that.help.DBNAME).collection(that.help.COLNAME);

    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // 1 - Iterate CCS Regions
      const ccsDir = that.help.makeDir(year, month, 'ccs');
      // console.log(' --- CCS REGIONS', month, year, '---');
      for (const regionName of Object.keys(that.help.regions)) {
        that.makeRegionMonth(col, regionName, month, year, ccsDir, true);
      }

      // 2 - Iterate Parking Providers
      const provDir = that.help.makeDir(year, month, 'providers');
      // console.log(' --- PARKING PROVIDER (AREAS)', month, year, '---');
      for (const areaName of Object.keys(that.help.providers)) {
        that.makeRegionMonth(col, areaName, month, year, provDir, false);
      }

      // Next Month
      if (month < 12) month++; else month = 1; year++;
    }
    that.client.close();
  });
};

/**
 * Test function. Creates email files for one area over one month.
 *
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
    const col = that.client.db(that.help.DBNAME).collection(that.help.COLNAME);
    that.makeRegionMonth(col, areaName, month, year, dir, true);
    that.client.close();
  });
};


module.exports = EmailMaker;


// If run from command line
// TODO: Create simple command line interface
if (require.main === module) {
  const em = new EmailMaker();

  em.main(12, 2019);
  // em.oneEmail(12, 2019, 'ccs', 'central');
}
