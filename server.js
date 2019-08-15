/* CCS Dashboard App
 *
 * Author: PJP Scriven
 * Date: 20 Aug 2018
 * Updated: 2 Aug 2019
 */

// IMPORTS
const express = require('express');
const mustache = require('mustache-express');
const abuse = require('./routes/abuse');

// CONSTANTS
const app = express();

// Config
app.use('/static', express.static(__dirname+'/static'));
app.engine('html', mustache()); // Set .html files to be processed by mustache
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Logging
let reqCount = 1;
app.use((req, res, next) => {
  console.log('Request:', reqCount++, req.url);
  next();
});

// Homepage
app.get('/', function(req, res) {
  res.render('index');
});

// Abuses API
app.use('/abuse', abuse);

/**
// Echo Test
app.get('/echo', function(req, res) {
  const stuff = {'headers': req.headers, 'url': req.url, 'body': req.body};
  res.end(JSON.stringify(stuff, null, 2));
});
/** */

// 404
app.get('*', function(req, res) {
  res.status(404).send('Could not find '+req.url);
});

// Run Server
const port = process.env.PORT || 1337;
app.listen(port, () => console.log('Server running on', port));
