/**
 * Mongo Data Loader. Pulls data from SaferMe API
 * and loads it into local MongoDB database.
 *
 * Author: Peter JP Scriven
 * Started: 13 Feb 2019
 * Updated: 14 Apr 2019
 */

// IMPORTS
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const DataPuller = require('./puller.js');
const Helper = require('../helper.js');

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, {useNewUrlParser: true});
const puller = new DataPuller(help.getKey());

// true = pulls *whole* channel
// false = pulls 100
const PULLALL = false;

// true: pulls page by page
// false: pulls all pages at once
const RECURSIVEPULL = true;

// FUNCTIONS
/**
 * Main: Pull Data into database
 */
function main() {
  client.connect(function(err) {
    assert.equal(null, err);

    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);

    // Check if collection exists
    db.listCollections({}).toArray(deleteCollection);

    /**
     * Delete existing Collection
     * @param {*} err
     * @param {*} cols
     */
    function deleteCollection(err, cols) {
      assert.equal(null, err);
      for (const i in cols) {
        if ({}.hasOwnProperty.call(cols, i)) {
          const name = cols[i].name;
          if (name === help.COLNAME) {
            console.log(name, 'DELETED');
            collection.drop();
          }
        }
      }
    }

    // Pull new data
    if (PULLALL) {
      if (RECURSIVEPULL) {
        puller.getAllR(help.ABUSE_CHANNEL, loadToDatabase);
      } else {
        puller.getAll(help.ABUSE_CHANNEL, loadToDatabase);
      }
    } else {
      if (RECURSIVEPULL) {
        puller.getReportsBlockR(help.ABUSE_CHANNEL, 0, 2000, loadToDatabase);
      } else {
        puller.getReportsBlock(help.ABUSE_CHANNEL, 0, 100, loadToDatabase);
      }
    }

    /**
     * Populate
     * @param {*} reports
     */
    function loadToDatabase(reports) {
      collection.insertMany(reports, insertSuccess);
    }


    /**
     * Double check insertion successful
     * @param {*} err
     */
    function insertSuccess(err) {
      assert.equal(err, null);
      console.log('...\nSuccessfully inserted!');
      client.close();
    }

    /**
     * Print one result
     * @param {*} err
     * @param {*} docs
     */
    // function logOneReport(err, docs) {
    //   assert.equal(err, null);
    //   console.log('Found the following records:');
    //   console.log('id:', docs.id);
    // }

    /**
     * Print all results
     * @param {*} err
     * @param {*} docs
     */
    // function logReportList(err, docs) {
    //   assert.equal(err, null);
    //   console.log('Found the following records:');
    //   for (let i=0; i<docs.length; i++) {
    //     const doc = docs[i];
    //     console.log('id:', doc.id);
    //   }
    // }
  });
}

/**
 * Helper
 */
// function listAll() {
//   collection.find({}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     console.log('Found the following records:');
//     console.log(docs);
//     client.close();
//   });
// }

/**
 * Tester
 */
// function test() {
//   console.log('Running test...');
//   puller.getReportsBlock(help.ABUSE_CHANNEL, 0, 20, (reports) => {
//     console.log('...\nReports recived:', reports.length);
//     console.log('First report id:', reports[0].id);
//   });
// }

// test();
module.exports.init = main();
