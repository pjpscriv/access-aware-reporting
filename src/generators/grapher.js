/**
 * The Graphing Module to draw graphs.
 *
 * Author: Peter JP Scriven
 * Started: 17 Mar 2019
 * Updated: 26 Jul 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
// const assert = require('assert');
const plotly = require('plotly')('accessaware', 'gvctlNfABdbXkh1No40E');
const Helper = require('../helper.js');
// const MongoClient = require('mongodb').MongoClient;

// CONSTANTS
const help = new Helper();
// const client = new MongoClient(help.URL, {useNewUrlParser: true});

// FUNCTIONS
/**
 * Get # reports per day from database
 *
 * @param {*} col
 * @param {*} month
 * @param {*} year
 * @param {*} region
 * @param {*} callback
 */
function getDayCounts(col, month, year, region, callback) {
  const results = {};
  const monthDays = help.daysInMonth(year, month);

  // Iterate Days
  for (let i=1; i<=monthDays; i++) {
    col.find({
      'location': {
        '$geoWithin': {
          '$polygon': region,
        },
      },
      'form_fields': {
        '$elemMatch': {
          'id': 24489,
          'value': help.dayRegEx(year, month, i),
        },
      },
      'report_state_name': {
        '$ne': 'Report rejected',
        // '$nin': [ 'Report rejected', 'Stored' ]
      },
    },
    {'projection': {
      '_id': 0,
      'location': 1,
    },
    }).toArray(makeCallback(i, monthDays));

    /**
     *
     * @param {*} day
     * @param {*} length
     * @return {*}
     */
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
      };
    }
  }
}


/**
 * Graph individual graph
 *
 * @param {*} collection
 * @param {*} month
 * @param {*} year
 * @param {*} region
 * @param {*} outFile
 */
function drawGraph(collection, month, year, region, outFile) {
  getDayCounts(collection, month, year, region, (results) => {
    const dates = Object.keys(results);
    const values = [];
    for (const i of dates) {
      values.push(results[i]);
    }

    const data = {
      x: dates,
      y: values,
      type: 'bar',
      text: values,
      textposition: 'auto',
    };

    const layout = {
      xaxis: {
        title: 'Day of the Month',
        // autotick: false,
        // ticks: 'outside',
        // tick0: 0,
        dtick: 1,
        // ticklen: 8,
        // tickwidth: 4,
        // tickcolor: '#000'
      },
      yaxis: {
        title: 'Number of Reports',
      },
    };

    const figure = {'data': [data], 'layout': layout};

    const options = {
      format: 'png',
      width: 800,
      height: 400,
    };

    plotly.getImage(figure, options, function(err, image) {
      if (err) return console.log(err);

      const file = fs.createWriteStream(outFile);
      image.pipe(file);
      console.log(outFile);
    });
  });
}

// Main: Iterator
/**
 * Yo.
 *
 * @param {*} collection
 * @param {*} month
 * @param {*} year
 * @param {*} dir
 * @param {*} areaName
 * @param {*} area
 */
function main(collection, month, year, dir, areaName, area) {
  const file = path.join(dir, 'graph', areaName+'_graph.png');
  drawGraph(collection, month, year, area, file);
}

module.exports = main;
