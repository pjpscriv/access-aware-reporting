/* 
 * Function wrappers around basic SaferMe API Calls.
 * 
 * Author: PJP Scriven
 * Started: 11 Sep 2018
 * Updated: 7 Feb 2019
 */

 // IMPORTS
var request = require("request");
var assert = require("assert");
var sha1 = require("sha1");

// CONSTRUCTOR
function ThunderMaps(key) {
    this.key = key;
}

// API CALLS
/** Base Method
 *  
 *  Parameters:
 *    uri      - The URL to which the request is being sent
 *    params   - Any url parameters (can be null)
 *    range    - An item range if needed (can be null)
 *    callback - Callback which takes an error and response argument
 */ 
ThunderMaps.prototype.apiGetCallRanged = function(uri, params, range, callback) {

    // Set up Headers
    var head = {
        "Authorization": "Token token=" +this.key,
        "Content-Type": "application/json",
        "X-AppID": "com.thundermaps.accessaware",
        "X-InstallationID": "thundermaps-api-" + sha1(this.key),
    }

    // Add Range if present
    if (range) {
        head["Range"] = range;
    }

    // Create Options
    var options = {
        uri: "https://public-api.thundermaps.com/api/v4/" + uri,
        // uri: "https://public-api.safer.me/api/v4/" + uri,
        method: "GET",
        headers: head,
        qs: params
        //, timeout: 50000
    }

    // ~ Make Request ~
    request(options, function(error, response, body) {
        if (error) {
            console.log("Error sending report: " + error);
            console.log(options.uri);
            callback(error, response);
        } else if (response.statusCode >= 400) {
            var err = new Error("Error sending report: received HTTP " + response.statusCode + " from server");
            console.log(err.message);
            callback(err, null)
        } else {
            callback(null, response);
        }
    });
}
ThunderMaps.prototype.apiGetCall = function(uri, callback) {
    this.apiGetCallRanged(uri, null, null, callback);
}


// Alert Areas
ThunderMaps.prototype.getAlertAreas = function(callback) {
    this.apiGetCall("alert_areas/", callback);
}
ThunderMaps.prototype.getAlertArea = function(alertAreaId, callback) {
    this.apiGetCall("alert_areas/"+alertAreaId, callback);
}

// Analytics
// Report Images
ThunderMaps.prototype.getReportImages = function(channelId, startDate, endDate, callback) {
    // TODO: Make date conversion better 
    var url = "analytics/reports_images?channel_id="+channelId+"&start_date="+startDate+"&end_date="+endDate;
    this.apiGetCall(url, callback);
};


// Channels
ThunderMaps.prototype.getChannels = function(callback) {
    // TODO: Follow up on ?only_operable_by_me=true
    this.apiGetCall("channels", callback);
};
ThunderMaps.prototype.getChannel = function(channelId, callback) {
    this.apiGetCall("channels/"+channelId, callback);
};


// Report States
ThunderMaps.prototype.getStates = function(channelId, callback) {
    this.apiGetCall("channels/"+channelId+"/report_states", callback);
};
ThunderMaps.prototype.getState = function(channelId, stateId, callback) {
    this.apiGetCall("channels/"+channelId+"/report_states/"+stateId, callback);
};
ThunderMaps.prototype.getStateHistory = function(reportId, callback) {
    this.apiGetCall("reports/"+reportId+"/report_state_changes", callback);
};


// Reports
ThunderMaps.prototype.getReports = function(channelId, from, to, callback) {
    assert.equal(typeof from, 'number');
    assert.equal(typeof to, 'number');
    //assert.equal(from <= to, true);

    var range = 'reports=' + from + '-' + to;

    this.apiGetCallRanged("channels/"+channelId+"/reports", null, range, callback);
};
ThunderMaps.prototype.getReport = function(reportId, callback) {
    var url = "reports/"+reportId;
    // Maximum potential params
    var maxParams = {
        fields: "account_name,"
              + "assignee_id,"
              + "assignment_due_at,"
              + "report_state_name,"
              + "form_fields"
    }
    this.apiGetCallRanged(url, maxParams ,null, callback);
};


// Users
ThunderMaps.prototype.getUsers = function(channelId, range, callback) {
    this.apiGetCallRanged("channels/"+channelId+"/users", null, range, callback);
};
ThunderMaps.prototype.getUser = function(channelId, userId, callback) {
    this.apiGetCall("channels/"+channelId+"/users/"+userId, callback);
};

module.exports = ThunderMaps;
