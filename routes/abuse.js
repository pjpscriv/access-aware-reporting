/**
 *
 * Date: 9 Aug 2019
 */
// IMPORTS
const express = require('express');
const assert = require('assert');
const Helper = require('../src/helper');
const MongoClient = require('mongodb').MongoClient;

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, {useNewUrlParser: true});
// eslint-disable-next-line new-cap
const router = express.Router(mergeParams=true);

/** ~~ MAIN - JSON Data API ~~
 * channel/region/month - e.g. /abuse/northern/2019-05
 */
const yParam = ':year([0-9]{4})';
const mParam = ':month([0-9]{2})';
const dParam = ':day([0-9]{2})';

// Year
router.get('/:area/year/'+yParam, (req, res) => {
  const area = help.getPolygon(req.params.area);
  const date = help.yearRegEx(parseInt(req.params.year));
  getReports(area, date, res);
});

// Month
router.get('/:area/month/'+yParam+'-'+mParam, (req, res) => {
  const area = help.getPolygon(req.params.area);
  const date = help.monthRegEx(parseInt(req.params.year),
      parseInt(req.params.month));
  getReports(area, date, res);
});

// Day
router.get('/:area/day/'+yParam+'-'+mParam+'-'+dParam, (req, res) => {
  const area = help.getPolygon(req.params.area);
  const date = help.dayRegEx(parseInt(req.params.year),
      parseInt(req.params.month), parseInt(req.params.day));
  getReports(area, date, res);
});


/** Get data from Database
 *
 * @param {*} area
 * @param {*} date
 * @param {*} res
 */
function getReports(area, date, res) {
  client.connect(function(err) {
    assert.equal(null, err);
    const collection = client.db(help.DBNAME).collection(help.COLNAME);
    const query = {
      'location': {'$geoWithin': {'$polygon': area}},
      'form_fields': {'$elemMatch': {'id': 24489, 'value': date}},
      'report_state_name': {'$ne': 'Report rejected'},
    };
    collection.find(query).toArray((err, data) => {
      assert.equal(err, null);
      res.send(data);
    });
  });
  // client.close();
};

// 404
router.get('*', (req, res) => {
  res.status(404).send('Abuses router. Could not find '+req.url);
});


module.exports = router;
