/**
 * Email Report maker.
 * 
 * Author: Peter JP Scriven
 * Started: 14 Nov 2018
 * Updated: 11 Mar 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const Helper = require('./helper.js')

// CONSTANTS
const help = new Helper();
const GM_TEMP_FILE = '../res/new_gm.html';
const MAC_TEMP_FILE = '../res/new_mac.html';

// MAIN
function main() {

  var gm_temp = fs.readFileSync(GM_TEMP_FILE, 'utf-8');
  var mac_temp = fs.readFileSync(MAC_TEMP_FILE, 'utf-8');

  var year = 2019; // 2017;
  var month = 1; // 3;
  
  var currYear = new Date().getFullYear();
  var currMonth = new Date().getMonth() + 1;
  
  // Iterate Months
  while ((year < currYear) || (year === currYear && month <= currMonth)) {
    // Iterate Regions
    for (let region of Object.keys(help.regions)) {
      var dir = help.makeDir(year, month);
      
      var optFile = path.join(dir, 'json', region+'.json');
      var gm_out  = path.join(dir, 'html', region+'_gm.html');
      
      var options = JSON.parse(fs.readFileSync(optFile, 'utf8'));

      console.log(options);

      // Write GM
      var gm_html  = mustache.render(gm_temp, options);
      fs.writeFileSync(gm_out, gm_html);

      // Write MACs
      for (let name of options.mac_names) {
        options.mac_name = name;
        var mac_out = path.join(dir,'html', region+'_mac_'+name.toLowerCase() + '.html');
        var mac_html = mustache.render(mac_temp, options);
        fs.writeFileSync(mac_out, mac_html);
      }
    }
    if (month < 12) { month++; }
    else { month = 1; year++; }
  }
}

// module.exports = main;

main();
