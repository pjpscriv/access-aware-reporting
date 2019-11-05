/** AJAX api. Returns HTML containing analysis of given
 * month and area.
 *
 * Format
 * -------
 * /ajax/<year>/<month>/<region>
 *
 * Date: 9 Aug 2019
 */
// IMPORTS
const fs = require('fs');
const express = require('express');
const mustache = require('mustache');

// CONSTANTS
// eslint-disable-next-line new-cap
const router = express.Router(mergeParams=true);
const template = fs.readFileSync('./views/ajax-template.html', 'utf-8');
const rParam = ':region';
const yParam = ':year([0-9]{4})';
const mParam = ':month([0-9]{2})';

// Route
router.get('/'+rParam+'/'+yParam+'/'+mParam, (req, res) => {
  const region = req.params.region;
  const year = req.params.year;
  const month = req.params.month;
  // console.log('Ajax request!', region, year, month);

  // Get Data
  const optFile = './generated/ccs/'+year+'/'+month+'/json/'+region+'.json';
  const options = JSON.parse(fs.readFileSync(optFile, 'utf8'));

  // Update image links
  const baseUrl = '/static/gen/ccs/'+year+'/'+month+'/';
  const mapUrl = baseUrl+'map/'+region+'_map.png';
  const graphUrl = baseUrl+'graph/'+region+'_graph.png';
  options.day_graph_url = graphUrl;
  options.map_url = mapUrl;

  // Create & Sent HTML
  const html = mustache.render(template, options);
  res.send(html);
});


// 404
router.get('*', (req, res) => {
  res.status(404).send('Ajax router. Could not find '+req.url);
});


module.exports = router;
