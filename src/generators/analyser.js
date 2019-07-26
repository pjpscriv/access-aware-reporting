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
    callback('common_address_list', dat);
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

    // Count park owners
    const owners = {};
    let sortedList = [];
    for (const item of dat) {
      const owner = item.form_fields[0].value;
      if (owner !== null & owner !== '') {
        // owner = owner.toLowerCase();
        if (owners[owner] == null) {
          owners[owner] = 1;
        } else {
          owners[owner]++;
        }
      }
      // Sort owners list by count
      sortedList = Object.keys(owners).sort((a, b) => {
        return owners[b] - owners[a];
      });
    }

    const commonOwners = [];
    const cutoff = 4;
    for (const i in sortedList) {
      if ({}.hasOwnProperty.call(sortedList, i)) {
        // console.log('i',i, JSON.stringify(sortedList[i]))
        commonOwners.push({name: sortedList[i], count: owners[sortedList[i]]});
        if (i >= cutoff) {
          break;
        }
      }
    }
    callback('common_owners_list', commonOwners);

    // console.log(out);
    const count = Math.max(0, sortedList.length - cutoff);
    callback('other_owners_count', count);
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
 * @param {*} callback Takes result file and renders HTML Email
 * @return {*}
 */
function saveAnalysisFile(file, callback) {
  return (res) => {
    // Postprocessing. Dirty? Yes. But functional.
    // TODO: make better
    res.action = res.officer + res.tick_issued + res.unforce + res.veh_gone;
    res.all_notif = res.park_notif + res.action;

    fs.writeFile(file, JSON.stringify(res, null, 2), null, (err) => {
      assert.equal(err, null);
      console.log(file);
      callback(file);
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
 * @param {*} regionName
 * @param {*} callback
 */
function analyse(collection, help, year, month, regionName, callback) {
  // RESULT OBJECT
  const res = {
    // Main Info
    region: regionName[0].toUpperCase() + regionName.slice(1),
    month: help.monthsLong[month-1],
    year: year,
    // Names
    gm_name: help.GMs[regionName].first,
    mac_names: help.MACs[regionName].firsts,
    // Files
    map_url: regionName+'_map.png',
    day_graph_url: regionName+'_graph.png',
    // Interesting Mustache Action
    action: function() {
      return function(text, render) {
        return 'THIS IS TEST' + render(text);
      };
    },
    // function for getting monthly change S U R E L Y
    // test: function() {
    //   return function
    // },
  };

  // When result has this many keys, return it.
  const NUMBER_OF_DATA_POINTS = 23;

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
  const region = help.regions[regionName];

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
 * Main: Pull data from database. Filter by (month, region)
 *
 * @param {MongoClient} client
 * @param {Helper} help
 * @param {number} month The month
 * @param {number} year
 */
function main(client, help, month, year) {
  const collection = client.db(help.DBNAME).collection(help.COLNAME);
  const dir = help.makeDir(year, month);
  const regionNames = Object.keys(help.regions);
  // Iterate Regions
  for (const region of regionNames) {
    const file = path.join(dir, 'json', region+'.json');
    const render = renderer(month, year, region, help);
    analyse(collection, help, year, month, region,
        saveAnalysisFile(file, render));
  }
}


module.exports = main;
