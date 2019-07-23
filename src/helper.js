/**
 * File to store all the universally used constants
 * 
 * Author: Peter JP Scriven
 * Started: 6 Apr 2019
 * Updated: -
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// CONSTRUCTOR
function Helper() {

  // Channel IDs
  this.ABUSE_CHANNEL = 5357;
  
  // MongoDB Constants
  this.URL = 'mongodb://localhost:27017';
  this.DBNAME = 'accessaware';
  this.COLNAME = 'jul05allabuses';

  // Output directory
  this.OUTPUT_DIR = path.join(process.cwd(),'..','generated');

  // Map Marker File
  this.ICON_FILE = '../res/dot.png';

  // Months
  this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  this.monthsLong = ['January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December']

  // Regions
  this.regions = {
    northern: [
      [ -37.62728430268013, 174.61669921875 ],
      [ -37.26749576438184, 175.57662963867188 ],
      [ -36.383701633929306, 175.133056640625 ],
      [ -36.35273908735874, 176.209716796875 ],
      [ -35.02099970111467, 175.1220703125 ],
      [ -34.03445260967644, 173.045654296875 ],
      [ -34.46127728843705, 171.837158203125 ],
      [ -37.62728430268013, 174.61669921875 ]
    ],
    midlands: [
      [ -38.700515838688716, 174.2926025390625 ],
      [ -38.773357720269054, 174.88311767578125 ],
      [ -38.47724452895558, 175.5999755859375 ],
      [ -39.2705371709551, 175.5780029296875 ],
      [ -39.12153746241925, 176.07513427734375 ],
      [ -40.01709786313761, 176.16920471191406 ],
      [ -40.362765146987606, 176.4575958251953 ],
      [ -40.48873742102282, 177.044677734375 ],
      [ -37.81412370160446, 179.36279296875 ],
      [ -36.35273908735874, 176.209716796875 ],
      [ -36.383701633929306, 175.133056640625 ],
      [ -37.26749576438184, 175.57662963867188 ],
      [ -37.62728430268013, 174.61669921875 ],
      [ -38.700515838688716, 174.2926025390625 ]
    ],
    central: [
      [ -40.47411375247882, 176.96777343749997 ],
      [ -42.187829010590825, 175.73455810546875 ],
      [ -41.47154438707646, 174.3695068359375 ],
      [ -40.2585687639126, 174.8089599609375 ],
      [ -39.317300373271024, 172.957763671875 ],
      [ -38.700515838688716, 174.2926025390625 ],
      [ -38.773357720269054, 174.88311767578125 ],
      [ -38.47724452895558, 175.5999755859375 ],
      [ -39.2705371709551, 175.5780029296875 ],
      [ -39.12153746241925, 176.07513427734375 ],
      [ -40.01709786313761, 176.16920471191406 ],
      [ -40.47411375247882, 176.96777343749997 ]
    ],
    southern: [
      [ -45.36758436884978, 172.70507812500003 ],
      [ -42.67435857693384, 175.64666748046878 ],
      [ -41.96357478222518, 174.33654785156256 ],
      [ -40.75974059207393, 174.7210693359375 ],
      [ -39.825413103424786, 172.86987304687506 ],
      [ -43.88205730390538, 167.62939453125 ],
      [ -46.55886030311717, 165.1904296875 ],
      [ -48.03401915864285, 167.98095703125 ],
      [ -45.36758436884978, 172.70507812500003 ]
    ]
  }

  // Names
  this.GMs = { northern: { full: 'Tina Syme', 
                          first: 'Tina' },
              midlands: { full: 'Colene Herbert', 
                          first: 'Colene' },
              central:  { full: 'Janine Richards', 
                          first: 'Janine' },
              southern: { full: 'Melissa Smith', 
                          first: 'Melissa' }
  }
  this.MACs = { northern: { fulls: ['Vivian Naylor'],
                            firsts: ['Vivian'] },
                midlands: { fulls: ['Mandy Gudgeon', 'Maurice Flynn'],
                            firsts: ['Mandy', 'Maurice'] },
                central:  { fulls: ['Raewyn'],
                            firsts: ['Raewyn'] },
                southern: { fulls: ['BJ Clark', 'Mary O\'Brien'],
                            firsts: ['BJ', 'Mary'] }
  };
}

// FUNCTIONS
Helper.prototype.getKey = function() {
  try {
      return fs.readFileSync('../res/api-key.txt').toString();
  } catch (err1) {
      try {
          return fs.readFileSync('./res/api-key.txt').toString();
      } catch (err2) {
          console.log(err1.message);
          console.log(err2.message);
          return;
      }
  }
}

Helper.prototype.dayRegEx = function(year, month, day) {
  var text = "^" + year + "-" + 
              (month < 10 ? '0' : '') + month + '-' +
              (day < 10 ? '0' : '') + day;
  return new RegExp(text);
}

Helper.prototype.monthRegEx = function(year, month) {
  var text = "^" + year + "-" + (month < 10 ? '0' : '') + month;
  return new RegExp(text);
}

Helper.prototype.lastMonthRegEx = function(year, month) {
  assert.equal(true, (0 < month) && (month < 13))
  if (month === 1) {
    return this.monthRegEx(year-1, 12);
  } else {
    return this.monthRegEx(year, month-1);
  }
}

Helper.prototype.daysInMonth = function(year, month) {
  return new Date(year, month, 0).getDate();
}

Helper.prototype.mkDirPath = function(dirPath) {

  if(!fs.existsSync(dirPath, fs.constants.R_OK | fs.constants.W_OK)) {
    try {
      fs.mkdirSync(dirPath);
    } catch(e) {
      this.mkDirPath(path.dirname(dirPath));
      this.mkDirPath(dirPath);
    }
  }
}


Helper.prototype.makeDir = function(year, month) {

  var monthStr = (month<10 ? '0'+month : month) + ' - ' + this.months[month-1];
  var monthDir = path.join(this.OUTPUT_DIR, String(year), monthStr);
  var subDirs  = ['csv', 'json', 'map', 'graph', 'html'];

  // Make sub-directories
  for (var dir of subDirs) {
    var subDir = path.join(this.OUTPUT_DIR, String(year), monthStr, dir);
    this.mkDirPath(subDir);
  }

  return monthDir;
}

module.exports = Helper;
