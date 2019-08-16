/**
 *
 * Date: 9 Aug 2019
 */
// IMPORTS
const fs = require('fs');
const express = require('express');
// const assert = require('assert');
// const Helper = require('../src/helper');
const mustache = require('mustache');

// CONSTANTS
// const help = new Helper();
// eslint-disable-next-line new-cap
const router = express.Router(mergeParams=true);

const TEMPLATE = './views/ajax-template.html';

const rParam = ':region';
const yParam = ':year([0-9]{4})';
const mParam = ':month([0-9]{2})';

router.get('/'+yParam+'/'+mParam+'/'+rParam, (req, res) => {
  const region = req.params.region;
  const year = req.params.year;
  const month = req.params.month;
  console.log('Ajax request!', region, year, month);

  const template = fs.readFileSync(TEMPLATE, 'utf-8');
  const optionsFile = './generated/ccs/'+year+'/'+month+
      '/json/'+region+'.json';
  const options = JSON.parse(fs.readFileSync(optionsFile, 'utf8'));

  const baseUrl = '/static/gen/ccs/'+year+'/'+month+'/';
  const mapUrl = baseUrl+'map/'+region+'_map.png';
  const graphUrl = baseUrl+'graph/'+region+'_graph.png';

  options.day_graph_url = graphUrl;
  options.map_url = mapUrl;

  const html = mustache.render(template, options);

  res.send(html);
});


// 404
router.get('*', (req, res) => {
  res.status(404).send('Ajax router. Could not find '+req.url);
});


module.exports = router;
