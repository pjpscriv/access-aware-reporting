/* CCS Dashboard App
 *
 * Author: PJP Scriven
 * Date: 20 Aug 2018
 * Updated: 2 Aug 2019
 */

// IMPORTS
// const fs = require('fs');
const express = require('express');
const mustache = require('mustache-express');
// const api = require('./src/get_api');

// CONSTANTS
// const THUNDERMAPS_API_KEY = fs.readFileSync('api-key.txt');
let reqCount = 1;
const app = express();

// Config
app.use('/static', express.static(__dirname+'/static'));
app.engine('html', mustache()); // Set .html files to be processed by mustache
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Logging
/**
 *
 * @param {*} req
 * @param {*} res
 */
function count(req, res) {
  console.log('Request:', reqCount++);
  console.log('URL:    ', req.url);
}

// Homepage
app.get('/', function(req, res) {
  res.render('thing');
  count(req, res);
});

/**
 * ~~ MAIN ~~
 *
 * JSON Data API
 * Should send requests something like:
 * channel/region/month
 * e.g. /abuse/northern/may19
 * or..
 * channel/region/time_period/period_index/
 *      e.g. /abuse/northern/day/0 = today
 *      e.g. /abuse/northern/day/1 = yesterday
 *      e.g. /abuse/northern/month/3 = 3 months ago
 * ...maybe?
 */
app.get('/abuse', function(req, res) {
  res.render('abuses');
  count(req, res);
});

// Echo
app.get('/echo', function(req, res) {
  const stuff = {
    'headers': req.headers,
    'url': req.url,
    'body': req.body,
  };
  res.end(JSON.stringify(stuff, null, 2));
  count(req, res);
});

// Play
app.get('/test/:word', function(req, res) {
  const options = {
    'test': req.params.word,
  };
  res.render('thing', options);
  count(req, res);
});

// 404
app.get('*', function(req, res) {
  res.status(404).send('Could not find '+req.url);
  count(req, res);
});
/* */

const port = process.env.PORT || 1337;
app.listen(port, () => console.log('Server running on', port));
