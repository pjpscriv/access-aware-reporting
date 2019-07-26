/**
 * Email Report maker.
 *
 * Author: Peter JP Scriven
 * Started: 14 Nov 2018
 * Updated: 29 Jul 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
// const Helper = require('./helper.js');

// CONSTANTS
// const help = new Helper();
const TEMPLATE = '../views/mustache/template.html';

// MAIN
/**
 *
 * @param {*} month
 * @param {*} year
 * @param {*} region
 * @param {*} help
 * @return {*}
 */
function main(month, year, region, help) {
  return function(optFile) {
    const options = JSON.parse(fs.readFileSync(optFile, 'utf8'));

    const dir = help.makeDir(year, month);
    const template = fs.readFileSync(TEMPLATE, 'utf-8');

    // Write GM
    options.mac = false;
    const gmOut = path.join(dir, 'html', region+'_gm.html');
    fs.writeFileSync(gmOut, mustache.render(template, options));
    console.log(gmOut);

    // Write MACs
    options.mac = true;
    for (const name of options.mac_names) {
      options.mac_name = name;
      const fileName = region + '_mac_' + name.toLowerCase() + '.html';
      const macOut = path.join(dir, 'html', fileName);
      fs.writeFileSync(macOut, mustache.render(template, options));
      console.log(macOut);
    }
  };
}

module.exports = main;
