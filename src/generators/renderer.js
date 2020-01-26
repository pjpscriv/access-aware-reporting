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
const TEMPLATE = './views/email.html';

// MAIN
/**
 *
 * @param {*} dir
 * @param {*} region
 * @return {function} Callback that takes analyser JSON file
 */
function renderCcsEmails(dir, region) {
  return function(optionsFile) {
    const template = fs.readFileSync(TEMPLATE, 'utf-8');
    const options = JSON.parse(fs.readFileSync(optionsFile, 'utf8'));

    // Write GM
    options.mac = false;
    options.name = options.gm_name;
    const gmOut = path.join(dir, 'html', region+'_gm.html');
    fs.writeFileSync(gmOut, mustache.render(template, options));
    console.log(gmOut);

    // Write MACs
    options.mac = true;
    for (const name of options.mac_names) {
      options.name = name;
      const fileName = region + '_mac_' + name.toLowerCase() + '.html';
      const macOut = path.join(dir, 'html', fileName);
      fs.writeFileSync(macOut, mustache.render(template, options));
      console.log(macOut);
    }
  };
}

/**
 * Write Provider Email
 *
 * @param {*} dir
 * @param {*} area
 * @return {*}
 */
function renderProviderEmails(dir, area) {
  return function(optionsFile) {
    const template = fs.readFileSync(TEMPLATE, 'utf-8');
    const options = JSON.parse(fs.readFileSync(optionsFile, 'utf8'));
    options.mac = false;
    const file = path.join(dir, 'html', area+'.html');
    fs.writeFileSync(file, mustache.render(template, options));
    console.log(file);
  };
}

/**
 *
 * @param {*} dir
 * @param {*} region
 * @param {*} isRegion
 * @return {*}
 */
function main(dir, region, isRegion) {
  if (isRegion) {
    return renderCcsEmails(dir, region);
  } else {
    return renderProviderEmails(dir, region);
  }
}


module.exports = main;
