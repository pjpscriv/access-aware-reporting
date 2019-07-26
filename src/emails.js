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

    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {
      // Filter
      filter(client, help, month, year);
      // Analyser + Renderer
      analyser(client, help, month, year);
      // Mapper
      mapper(client, help, month, year);
      // Grapher
      grapher(client, month, year);
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
