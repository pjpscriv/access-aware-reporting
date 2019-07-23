/**
 * Data Analyser. Pulls data from database, filters by 
 * month and CCS region and creates a summary of that
 * (month/region) data.
 * 
 * Author: Peter JP Scriven
 * Started: 13 Feb 2019
 * Updated: 6 Apr 2019
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const Helper = require('./helper.js');

// CONSTANTS
const help = new Helper();
const client = new MongoClient(help.URL, { useNewUrlParser: true });

// FUNCTIONS
// Query Functions
// TODO: Abstract out some query code? There's a lot of repetition here
function getValidReports(collection, date, region, callback) {
  
  var query = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "form_fields": {
      "$elemMatch": {
        "id": 24489,
        "value": date
      }
    },
    "report_state_name": { 
      "$ne": "Report rejected"
      // "$nin": [ "Report rejected", "Stored" ] 
    }
  }
  
  collection.find(query).toArray((err, dat) => {
      assert.equal(err, null);
      callback('valid_reports', dat.length);
    });
}

function getChange(collection, year, month, region, callback) {
  
  var date = help.lastMonthRegEx(year, month);

  var query = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "form_fields": {
      "$elemMatch": {
        "id": 24489,
        "value": date
      }
    },
    "report_state_name": { 
      "$ne": "Report rejected"
    }
  }
  
  collection.find(query).toArray((err, dat) => {
    assert.equal(err, null);
    callback(dat.length);
  });
}

function getAddresses(collection, date, region, callback) {

  var query = [
    { "$match": {
        "location": {
          "$geoWithin": {
            "$polygon": help.regions[region]
          }
        }
        ,
        "form_fields": {
          "$elemMatch": {
            "id": 24489,
            "value": date
          }
        }
      }
    },
    { "$group": {
      "_id": '$address',
      "count": { "$sum": 1 }
      }
    },
    { "$sort": { "count": -1 }
    },
    { "$limit": 5 }
  ];

  collection.aggregate(query).toArray((err, dat) => {
    assert.equal(err, null);
    callback('common_address_list', dat);
  });
}

function getOwnership(collection, date, region, callback) {

  // Get Public Parks
  var query1 = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "$and": [
      { "form_fields": {
          "$elemMatch": {
            "id": 24489,
            "value": date
          }
        }
      },
      { "form_fields": {
          "$elemMatch": {
            "id": 37191,
            "value": "f_4125_159_22_159_1"
          }
        }
      }
    ]
  }

  collection.find(query1).toArray((err, dat) => {
    assert.equal(err, null);
    callback('public', dat.length);
  });

  // Get Private Parks
  var query2 = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "$and": [
      { "form_fields": {
          "$elemMatch": {
            "id": 24489,
            "value": date
          }
        }
      },
      { "form_fields": {
          "$elemMatch": {
            "id": 37191,
            "value": "f_4125_159_22_161_2"
          }
        }
      }
    ]
  }

  collection.find(query2).toArray((err, dat) => {
    assert.equal(err, null);
    callback('private', dat.length);
  });

  // Get 'Not sure' Parks
  var query3 = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "$and": [
      { "form_fields": {
          "$elemMatch": {
            "id": 24489,
            "value": date
          }
        }
      },
      { "form_fields": {
          "$elemMatch": {
            "id": 37191,
            "value": "f_4125_159_22_163_3"
          }
        }
      }
    ]
  }

  collection.find(query3).toArray((err, dat) => {
    assert.equal(err, null);
    callback('not_sure', dat.length);
  });
}

function getOwners(collection, date, region, callback) {

  var query = {
    "location": {
      "$geoWithin": {
        "$polygon": help.regions[region]
      }
    },
    "$and": [
      { "form_fields": {
          "$elemMatch": {
            "id": 24489,
            "value": date
          }
        }
      },
      { "form_fields": {
          "$elemMatch": {
            "id": 37191,
            "value": "f_4125_159_22_161_2"
          }
        }
      }
    ]
  }

  var projection = {
    "_id": 0,
    "form_fields": { 
      "$elemMatch": { 
        "id": 55424
      } 
    } 
  }

  collection.find(query)
            .project(projection)
            .toArray((err, dat) => {
    assert.equal(err, null);

    var owners = {};
    var sortedList = [];
    for (let item of dat) {
      var owner = item.form_fields[0].value;
      if (owner !== null & owner !== '') {
        // owner = owner.toLowerCase();
        if (owners[owner] == null) {
          owners[owner] = 1;
        } else {
          owners[owner]++;
        }
      }
      sortedList = Object.keys(owners).sort((a, b) => {
        return owners[b] - owners[a]
      })
    }

    var out = []
    var cutoff = 4;
    for (let i in sortedList) {
      // console.log('i',i, JSON.stringify(sortedList[i]))
      out.push({name: sortedList[i], count: owners[sortedList[i]]});
      if (i >= cutoff) {
        break;
      }
    }
    // console.log(out);
    var count = Math.max(0, sortedList.length - cutoff);
    callback('other_owners_count', count);
    callback('common_owners_list', out);
  });


}

function getStates(collection, date, region, callback) {

  var states = {
    invalid: 35328,
    thanks_reps: 11740,
    park_notif: 30146,
    officer: 17447,
    tick_issued: 20162,
    unforce: 20673,
    veh_gone: 20166
  }
  
  for (key of Object.keys(states)) {

    var query = {
      "location": {
        "$geoWithin": {
          "$polygon": help.regions[region]
        }
      },
      "form_fields": {
        "$elemMatch": {
          "id": 24489,
          "value": date
        }
      },
      "report_state_id": states[key]
    }
    
    collection.find(query).toArray(createCallback(key));
    
    function createCallback(state) {
      return (err, dat) => {
        assert.equal(err, null);
        callback(state, dat.length);
      }
    };
  }
}


// Callback Wrapper
function saveAnalysisCallBack(file) {
  return (res) => {

    // Postprocessing. Dirty? Yes. But functional. TODO: make better
    res.action = res.officer + res.tick_issued + res.unforce + res.veh_gone;
    res.all_notif = res.park_notif + res.action;

    var pad = '-----------------------';
    console.log(pad, res.year, res.month.slice(0,3), res.region.toLowerCase(), pad)
    console.log(res);

    fs.writeFile(file, JSON.stringify(res, null, 2), null, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(file, 'written!');
    });
  }
}

// Analysis Function
function analyse(collection, year, month, region, callback) {
  
  var res = { region: region[0].toUpperCase() + region.slice(1), 
              month: help.monthsLong[month-1], 
              year: year,
              gm_name: help.GMs[region].first,
              mac_names: help.MACs[region].firsts,
              map_url: region+'_map.png',
              day_graph_url: region+'_graph.png',
              action: function() {
                return function(text, render) {
                  return "THIS IS TEST" + render(text);
                }
              }
            };

  var date = help.monthRegEx(year, month);

  // Queries
  var NUMBER_OF_DATA_POINTS = 23;
  getValidReports(collection, date, region, saveToRes);
  getChange(collection, year, month, region, monthChanges);
  getAddresses(collection, date, region, saveToRes);
  getOwnership(collection, date, region, saveToRes);
  getStates(collection, date, region, saveToRes);
  getOwners(collection, date, region, saveToRes);

  // Callbacks
  function saveToRes(name, val) {
    res[name] = val;
    if (Object.keys(res).length > NUMBER_OF_DATA_POINTS) {
      callback(res)
    }
  }
  function monthChanges(lastmonth) {
    var amount = res.valid_reports - lastmonth;
    saveToRes('last_month', lastmonth);

    var change = {
      amount: Math.abs(amount),
      incr_decr: amount < 0 ? 'Down' : 'Up'
    }
    if (amount === 0) { 
      saveToRes('change', false); 
    } else { 
      saveToRes('change', change); 
    }
  }
}

// Main: Pull data from database. Filter by (month, region)
function main() {
  
  client.connect(function(err) {
    assert.equal(null, err);
    
    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);
    
    var year = 2018; // 2017;
    var month = 12; // 3;
    
    var currYear = new Date().getFullYear();
    var currMonth = new Date().getMonth() + 1;
    
    // Iterate Months
    while ((year < currYear) || (year === currYear && month <= currMonth)) {

      var dir = help.makeDir(year, month);
      
      // Iterate Regions
      for (let region of Object.keys(help.regions)) {
        var file = path.join(dir,'json',region + '.json');
        
        analyse(collection, year, month, region, saveAnalysisCallBack(file));
      }
      
      if (month < 12) { month++; }
      else { month = 1; year++; }
    }

    client.close()
  });
}

function test() {
  
  client.connect(function(err) {
    assert.equal(null, err);
    
    const db = client.db(help.DBNAME);
    const collection = db.collection(help.COLNAME);
    
    var year = 2018; // 2017;
    var month = 12; // 3;
    var region = 'midlands';

    var file = path.join(help.makeDir(year, month), region+'.json');

    analyse(collection, year, month, region, saveAnalysisCallBack(file));

    // Iterate Regions
    // for (let region of Object.keys(help.regions)) {
    //   analyse(collection, year, month, region, saveAnalysisCallBack(file));
    // }

    client.close()
  });
}

// test();
main();
