/**
 * Data Puller. Pulls data from the SaferMe API given a
 * specific channel. Can pull entire channel or just a block.
 *
 * Author: PJP Scriven
 * Started: 1 Nov 2018
 * Updated: 14 Apr 2019
 */

// IMPORTS
const assert = require('assert');
const ThunderMaps = require('./api');

/**
 * CONSTRUCTOR
 * @param {*} key
 */
function DataPuller(key) {
  this.api = new ThunderMaps(key);
  this.reports = [];
  this.idMap = {};
  this.requestIds = [];
}

// FUNCTIONS
// Helpers
DataPuller.prototype.printReport = function(report) {
  const id = report.id;
  const date = new Date(report.iso_created_at);

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'};
  const dateStr = date.toLocaleString('en-NZ', options);

  console.log(this.idMap[id], '//', dateStr, '//', report.id);
};
DataPuller.prototype.parseRange = function(range) {
  const from = parseInt(range.slice(range.indexOf(' ')+1, range.indexOf('-')));
  const to = parseInt(range.slice(range.indexOf('-')+1, range.indexOf('/')));
  const total = parseInt(range.slice(range.indexOf('/')+1, range.length));
  return {from: from, to: to, total: total};
};
DataPuller.prototype.sortReports = function(reps) {
  return reps.sort((a, b) => {
    if (a.request_id < b.request_id) {
      return -1;
    } else if (a.request_id > b.request_id) {
      return 1;
    } else {
      return 0;
    }
  });
};
DataPuller.prototype.getMissing = function() {
  const ids = new Set(this.requestIds);
  this.reports.forEach((report) => {
    ids.delete(report.request_id);
  });
  return ids;
};
DataPuller.prototype.getTotalReports = function(channelId, callback) {
  this.api.getReports(channelId, 0, 0, (err, result) => {
    const range = this.parseRange(result.headers['content-range']);
    callback(range.total);
  });
};

// 1. ---------------------- Iterative Method ----------------------
// Pull single report
DataPuller.prototype.pullReportData = function(reportId, callback) {
  console.log('req:', this.idMap[reportId], '//', reportId);

  this.api.getReport(reportId, (err, res) => {
    if (err) {
      console.error('Error!', err);
      this.pullReportData(reportId, callback);
      console.log('Retried:', reportId);
      return;
    }

    const report = JSON.parse(res.body);
    report['request_id'] = this.idMap[report.id];
    this.reports.push(report);

    const miss = this.getMissing();
    console.log('rtn:', this.idMap[report.id], '(', miss.size, 'left)');
    if (miss.size === 0) { // End Condition
      callback(this.reports);
    } else if (miss.size < 10) {
      console.log('Missing:', miss);
    } else {
      // console.log('Missing:', miss.size);
    }
  });
};

// Get report information for a page of reports
DataPuller.prototype.getDetails = function(body, range, callback) {
  for (let i=0; i<body.length; i++) {
    const reportId = body[i]['id'];
    this.idMap[reportId] = range.from + i;
    this.pullReportData(reportId, callback);
  }
};

// ~ MAIN ~
DataPuller.prototype.getPage = function(channelId, index, index2, callback) {
  console.log('PAGE:', index, index2);

  this.api.getReports(channelId, index, index2, (err, res) => {
    if (err) {
      console.error('Error!', err);
      this.getPage(channelId, index, index2, callback);
      console.log('Retried:', channelId, index, index2);
      return;
    }

    const range = this.parseRange(res.headers['content-range']);
    this.getDetails(JSON.parse(res.body), range, callback);
    console.log(range);
  });
};

// Start
DataPuller.prototype.getReportsBlock = function(
    channel, start, amount, callback) {
  const pageSize = 100;

  this.getTotalReports(channel, (total) => {
    assert.equal(start >= 0, true, 'Index below zero');
    assert.equal(start < total, true, 'Index above maximum');

    // Don't request more than total reports
    if ((start + amount) > total) {
      amount = total - start;
    }

    console.log('STRT', start, amount, total, pageSize);

    // Generate request IDs
    this.requestIds = Array.from({length: amount}, (v, k) => start+k);

    // Send requests
    for (let i=start; i<(start+amount); i+=pageSize) {
      if (i+pageSize < start+amount) {
        this.getPage(channel, i, i+pageSize-1, callback);
      } else {
        this.getPage(channel, i, start+amount-1, callback);
      }
    }
  });
};

// Pulls all pages
DataPuller.prototype.getAll = function(channel, callback) {
  const pageSize = 100;

  this.getTotalReports(channel, (total) => {
    console.log('STRT', 0, total, pageSize);

    // Send requests
    this.requestIds = Array.from({length: total}, (v, k) => k++);
    for (let i=0; i<total; i+=pageSize) {
      if (i+pageSize < total) {
        this.getPage(channel, i, i+pageSize-1, callback);
      } else {
        this.getPage(channel, i, total-1, callback);
      }
    }
  });
};

// 2. ---------------------- Recursive Method ----------------------
DataPuller.prototype.pullReportDataR = function(reportId, callback) {
  console.log('req:', this.idMap[reportId], '//', reportId);

  this.api.getReport(reportId, (err, res) => {
    if (err) {
      console.error('Error!', err);
      this.pullReportData(reportId, callback);
      console.log('Retried:', reportId);
      return;
    }

    const report = JSON.parse(res.body);
    const requestId = this.idMap[report.id];
    report['request_id'] = requestId;
    this.reports.push(report);

    this.blockIds = this.blockIds.filter((id) => id !== requestId);
    const miss = this.blockIds;

    console.log('rtn:', this.idMap[report.id], '(', miss.length, 'left)');
    if (miss.length === 0) { // End Condition
      callback();
    } else if (miss.length < 10) {
      // console.log('Missing:', miss);
    } else {
      // console.log('Missing:', miss.size);
    }
  });
};

DataPuller.prototype.getDetailsR = function(body, range, isEnd, callback) {
  for (let i=0; i<body.length; i++) {
    const reportId = body[i]['id'];
    this.idMap[reportId] = range.from + i;
    this.pullReportDataR(reportId, () => {
      if (this.blockIds.length === 0) {
        if (isEnd) {
          callback(this.reports);
        } else {
          callback();
        }
      }
    });
  }
};

DataPuller.prototype.getPageR = function(
    channelId, index, index2, end, pageSize, callback) {
  console.log(`PAGE: ${index}-${index2} ${end}`);
  this.blockIds = Array.from({length: index2-index}, (v, k) => index + k);

  this.api.getReports(channelId, index, index2, (err, res) => {
    if (err) {
      console.error('Error!', err);
      this.getPageR(channelId, index, index2, end, callback);
      console.log('Retried:', channelId, index, index2);
      return;
    }

    // Settings to get this page
    const range = this.parseRange(res.headers['content-range']);
    const body = JSON.parse(res.body);

    // Settings to request next page
    const i3 = index2+1;
    let i4 = index2+pageSize;
    if (i4 > end) {
      i4 = end;
    }

    if (i3 > end) {
      this.getDetailsR(body, range, true, callback);
    } else {
      this.getDetailsR(body, range, false, () => {
        this.getPageR(channelId, i3, i4, end, pageSize, callback);
      });
    }
    console.log(range);
  });
};

DataPuller.prototype.getReportsBlockR = function(
    channel, start, amount, callback) {
  let pageSize = 100;
  let end = start + amount - 1;

  this.getTotalReports(channel, (total) => {
    assert.equal(start >= 0, true, 'Index below zero');
    assert.equal(start < total, true, 'Index above maximum');

    // Don't request more than total reports
    if (end >= total) {
      end = total-1;
      amount = total - start;
    }

    if (amount < pageSize) {
      pageSize = amount;
    }

    console.log(`STRT ${start}-${end} ${amount} (${pageSize})`);

    // Generate request IDs
    this.requestIds = Array.from({length: amount}, (v, k) => start+k);

    // Send requests
    this.getPageR(channel, start, start+pageSize-1, end, pageSize, callback);
  });
};

// Pulls pages one after another (Recursively)
DataPuller.prototype.getAllR = function(channel, callback) {
  const pageSize = 100;

  this.getTotalReports(channel, (total) => {
    // Send requests
    const start = 0;
    const end = total - 1;
    const amount = total;

    console.log(`STRT ${start}-${end} ${amount} (${pageSize})`);

    // Generate request IDs
    this.requestIds = Array.from({length: total}, (v, k) => k++);

    this.getPageR(channel, start, start+pageSize-1, end, pageSize, callback);
  });
};

module.exports = DataPuller;
