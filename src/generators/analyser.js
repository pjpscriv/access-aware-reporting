/**
 * Data Analyser. Pulls data from database, filters by
 * month and CCS region and creates a summary of that
 * (month/region) data.
 *
 * Author: Peter JP Scriven
 * Started: 13 Feb 2019
 * Updated: 26 Jul 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const renderer = require('./renderer.js');

// FUNCTIONS
// Query Functions
// TODO: Abstract out some query code? There's a lot of repetition here
/**
 * Get number of valid (non-rejected) abuse reports for this month.
 *
 * @param {object} collection
 * @param {date} date
 * @param {object} region
 * @param {function} callback
 */
function getValidReports(collection, date, region, callback) {
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

  collection.find(query).toArray((err, dat) => {
    assert.equal(err, null);
    // console.log(date, 'Valids:', dat.length);
    callback('valid_reports', dat.length);
  });
}

/**
 * Get change in number of abuses from last month.
 *
 * @param {*} collection
 * @param {*} date
 * @param {*} region
 * @param {*} callback
 */
function getChange(collection, date, region, callback) {
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
    },
  };

  collection.find(query).toArray((err, dat) => {
    assert.equal(err, null);
    callback(dat.length);
  });
}

/**
 * Get an address list of the most commonly abused parks.
 *
 * @param {*} collection
 * @param {*} date
 * @param {*} region
 * @param {*} callback
 */
function getAddresses(collection, date, region, callback) {
  const query =
    [{
      '$match': {
        'location': {
          '$geoWithin': {'$polygon': region},
        },
        'form_fields': {
          '$elemMatch': {
            'id': 24489,
            'value': date,
          },
        },
      },
    },
    {
      '$group': {
        '_id': '$address',
        'count': {'$sum': 1},
      },
    },
    {'$sort': {'count': -1}},
    {'$limit': 5},
    ];

  collection.aggregate(query).toArray((err, dat) => {
    assert.equal(err, null);
    const cleaned = [];
    for (addr of dat) {
      if (addr.count === 1) {
        cleaned.push({address: addr._id, reports: '1 report'});
      } else {
        cleaned.push({address: addr._id, reports: addr.count+' reports'});
      }
    }
    callback('common_address_list', cleaned);
  });
}

/**
 * Get public/private/unsure park ownership counts.
 *
 * @param {*} collection
 * @param {*} date
 * @param {*} region
 * @param {*} callback
 */
function getOwnership(collection, date, region, callback) {
  // Get Public Parks
  const query1 = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    '$and': [
      {'form_fields': {
        '$elemMatch': {
          'id': 24489,
          'value': date,
        },
      },
      },
      {'form_fields': {
        '$elemMatch': {
          'id': 37191,
          'value': 'f_4125_159_22_159_1',
        },
      },
      },
    ],
  };

  collection.find(query1).toArray((err, dat) => {
    assert.equal(err, null);
    callback('public', dat.length);
  });

  // Get Private Parks
  const query2 = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    '$and': [
      {'form_fields': {
        '$elemMatch': {
          'id': 24489,
          'value': date,
        },
      },
      },
      {'form_fields': {
        '$elemMatch': {
          'id': 37191,
          'value': 'f_4125_159_22_161_2',
        },
      },
      },
    ],
  };

  collection.find(query2).toArray((err, dat) => {
    assert.equal(err, null);
    callback('private', dat.length);
  });

  // Get 'Not sure' Parks
  const query3 = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    '$and': [
      {'form_fields': {
        '$elemMatch': {
          'id': 24489,
          'value': date,
        },
      },
      },
      {'form_fields': {
        '$elemMatch': {
          'id': 37191,
          'value': 'f_4125_159_22_163_3',
        },
      },
      },
    ],
  };

  collection.find(query3).toArray((err, dat) => {
    assert.equal(err, null);
    callback('not_sure', dat.length);
  });
}

/**
 * Get list of owners of most commonly abused parks, as well as
 * a count of total number of reported park owners.
 *
 * @param {*} collection
 * @param {*} date
 * @param {*} region
 * @param {*} callback
 */
function getOwners(collection, date, region, callback) {
  const query = {
    'location': {
      '$geoWithin': {
        '$polygon': region,
      },
    },
    '$and': [
      {'form_fields': {
        '$elemMatch': {
          'id': 24489,
          'value': date,
        },
      },
      },
      {'form_fields': {
        '$elemMatch': {
          'id': 37191,
          'value': 'f_4125_159_22_161_2',
        },
      },
      },
    ],
  };

  const projection = {
    '_id': 0,
    'form_fields': {
      '$elemMatch': {
        'id': 55424,
      },
    },
  };

  collection.find(query).project(projection).toArray((err, dat) => {
    assert.equal(err, null);

    // Get list of owner names
    let names = dat.map((item) => {
      if (item.hasOwnProperty('form_fields')) {
        // Perhaps do some normalisation here
        return item.form_fields[0].value;
      }
    });

    names = names.filter((n) => (n !== null & n !== ''));

    // console.log(names);

    // Count up names
    const ownerCount = {};
    for (const o of names) {
      if (ownerCount[o] == null) {
        ownerCount[o] = 1;
      } else {
        ownerCount[o]++;
      }
    }

    // Sort owners list by count
    const sortedList = Object.keys(ownerCount).sort((a, b) => {
      return ownerCount[b] - ownerCount[a];
    });

    // Return the top 4 owners and their report counts
    let cutoff = 4;
    cutoff = (cutoff < sortedList.length ? cutoff : sortedList.length);
    const commonOwners = [];
    for (let i=0; i<cutoff; i++) {
      const name = sortedList[i];
      if (ownerCount[name] === 1) {
        commonOwners.push({name: name, reports: '1 report'});
      } else {
        commonOwners.push({name: name, reports: ownerCount[name]+' reports'});
      }
    }
    callback('common_owners_list', commonOwners);

    const remainder = Math.max(0, sortedList.length - cutoff);
    callback('other_owners_count', remainder);
  });
}

/**
 * Get report state counts.
 *
 * @param {*} collection
 * @param {*} date
 * @param {*} region
 * @param {*} callback
 */
function getStates(collection, date, region, callback) {
  const states = {
    invalid: 35328,
    thanks_reps: 11740,
    park_notif: 30146,
    officer: 17447,
    tick_issued: 20162,
    unforce: 20673,
    veh_gone: 20166,
  };

  for (key of Object.keys(states)) {
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
      'report_state_id': states[key],
    };

    collection.find(query).toArray(createCallback(key));

    /**
     * @param {*} state
     * @return {*}
     */
    function createCallback(state) {
      return (err, dat) => {
        assert.equal(err, null);
        callback(state, dat.length);
      };
    };
  }
}


/**
 * Callback Wrapper
 *
 * @param {*} file
 * @param {*} renderHtml Takes result file and renders HTML Email
 * @return {*}
 */
function saveAnalysisFile(file, renderHtml) {
  return (res) => {
    // Postprocessing. Dirty? Yes. But functional. TODO: make better
    res.action = res.officer + res.tick_issued + res.unforce + res.veh_gone;
    res.all_notif = res.park_notif + res.action;

    fs.writeFile(file, JSON.stringify(res, null, 2), null, (err) => {
      assert.equal(err, null);
      console.log(file);
      // Render HTML
      renderHtml(file);
    });
  };
}


/**
 * Analysis Function
 *
 * @param {*} collection
 * @param {*} help
 * @param {*} year
 * @param {*} month
 * @param {*} area
 * @param {*} isRegion
 * @param {*} callback
 */
function analyse(collection, help, year, month, area, isRegion, callback) {
  // Return result when it has this many keys
  let NUMBER_OF_DATA_POINTS = 22;

  // ~~~ RESULT OBJECT ~~~
  const res = {
    // Main Info
    region: help.prettyAreaName(area),
    month: help.monthsLong[month-1],
    year: year,
    // Files
    map_url: area+'_map.png',
    day_graph_url: area+'_graph.png',
    // Interesting Mustache Action
    action: function() {
      return function(text, render) {
        return 'THIS IS TEST' + render(text);
      };
    },
    is_ccs: isRegion,
    // function for getting monthly change S U R E L Y
    // test: function() {
    //   return function
    // },
  };

  // CCS Settings
  if (isRegion) {
    res.gm_name = help.GMs[area].first;
    res.mac_names = help.MACs[area].firsts;
    NUMBER_OF_DATA_POINTS += 2;
  }

  /**
   * Save values to results object. Return it when it gets big enough.
   * @param {*} name
   * @param {*} val
   */
  function saveToRes(name, val) {
    res[name] = val;
    if (Object.keys(res).length > NUMBER_OF_DATA_POINTS) {
      callback(res);
    }
  }

  const date = help.monthRegEx(year, month);
  const lastmonth = help.lastMonthRegEx(year, month);
  const region = help.getPolygon(area);

  getValidReports(collection, date, region, saveToRes);
  getChange(collection, lastmonth, region, monthChanges);
  getAddresses(collection, date, region, saveToRes);
  getOwnership(collection, date, region, saveToRes);
  getOwners(collection, date, region, saveToRes);
  getStates(collection, date, region, saveToRes);

  // TODO: Remove
  /**
   * @param {*} lastmonth
   */
  function monthChanges(lastmonth) {
    saveToRes('last_month', lastmonth);

    const amount = res.valid_reports - lastmonth;
    if (amount === 0) {
      saveToRes('change', false);
    } else {
      saveToRes('change', {
        amount: Math.abs(amount),
        incr_decr: amount < 0 ? 'Down' : 'Up',
      });
    }
  }
}


/**
 * Main analysis function. Pulls data from database, filters by (month, region),
 * performs analysis on this data and writes results to file.
 *
 * @param {*} collection MongoDB collection.
 * @param {Helper} help Provides helper functions.
 * @param {path} dir Directory to which files are written.
 * @param {int} month Month. Range 1-12.
 * @param {int} year Year e.g. 2018
 * @param {string} area Name of area to pull data from.
 * @param {boolean} isRegion If an area is an official CCS region.
 */
function main(collection, help, dir, month, year, area, isRegion) {
  const file = path.join(dir, 'json', area+'.json');
  const render = renderer(dir, area, isRegion);
  const callback = saveAnalysisFile(file, render);
  analyse(collection, help, year, month, area, isRegion, callback);
}


module.exports = main;
