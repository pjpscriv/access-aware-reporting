/**
 * Mapping Module. Draws a .png map of points for
 * a given region and month. Also draws the outline
 * of the region.
 *
 * Author: Peter JP Scriven
 * Started: 17 Mar 2019
 * Updated: 26 Jul 2019
 */

// IMPORTS
const path = require('path');
// const assert = require('assert');
const StaticMaps = require('staticmaps');

// FUNCTIONS
/**
 * Region outline converter
 *
 * @param {*} region
 * @return {*}
 */
function createPolyline(region) {
  const arr = [];
  for (let i=0; i<region.length; i++) {
    const point = [region[i][1], region[i][0]];
    arr.push(point);
  }
  return {coords: arr, color: '#333333BB', width: 3};
}

/**
 * Get the points of all valid reports
 *
 * @param {*} col
 * @param {*} date
 * @param {*} outFile
 * @param {*} region
 * @param {*} icon
 * @param {*} callback
 */
function getValidReports(col, date, outFile, region, icon, callback) {
  const query = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    'form_fields': {
      '$elemMatch': {
        'id': 24489,
        'value': date,
      },
    },
    'report_state_name': {
      '$ne': 'Report rejected',
      // '$nin': [ 'Report rejected', 'Stored' ]
    },
  };

  const projection = {
    'projection': {
      '_id': 0,
      'location': 1,
    },
  };

  col.find(query, projection).toArray((err, data) => {
    if (err) {
      console.error('Mongo err:', err);
    } else {
      callback(data, region, outFile, icon);
    }
  });
}

/**
 * Draw Individual Map
 *
 * @param {*} points
 * @param {*} region
 * @param {*} file
 * @param {string} icon
 */
function drawPointMap(points, region, file, icon) {
  // Create Map
  const options = {
    width: 800,
    height: 400,
    tileUrl: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  };
  const map = new StaticMaps(options);

  // Make Marker
  const marker = {
    img: icon,
    width: 1,
    height: 1,
    offsetX: 16,
    offsetY: 16,
  };

  // Add Markers to Map
  for (let i=0; i<points.length; i++) {
    const point = points[i].location;
    const long = point.longitude;
    const lat = point.latitude;
    marker.coord = [long, lat];

    map.addMarker(marker);
  }

  // Add Region Outline
  map.addLine(createPolyline(region));

  // Render
  map.render() // zoom=8
      .then(() => map.image.save(file))
      .then(() => {
        console.log(file);
      })
      .catch(function(err) {
        console.error('Error writing', file, ':', err);
      });
}


/**
 * Main: Queries Database. Draws map.
 * TODO: Filter by Public / Private for parking providers.
 *
 * @param {*} collection
 * @param {*} help
 * @param {*} date
 * @param {*} dir
 * @param {*} areaName
 * @param {*} area
 */
function main(collection, help, date, dir, areaName, area) {
  const file = path.join(dir, 'map', areaName+'_map.png');
  getValidReports(collection, date, file, area, help.ICON_FILE, drawPointMap);
}

module.exports = main;
