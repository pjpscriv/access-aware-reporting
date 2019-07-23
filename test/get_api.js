/* Test suite for API GET calls.
 * 
 * Author: PJP Scriven
 * Date   : 11 Sept 2018
 * Updated: 19 Oct 2018
 */

// IMPORTS
var fs = require('fs');
var assert = require('assert');
var ThunderMaps = require('../src/get_api');

// CONSTANT
const THUNDERMAPS_API_KEY = fs.readFileSync('./api-key.txt');

//TESTS

// TODO: Add header tests to responses
describe('Array', function() {

  // Variables
  var tm = new ThunderMaps(THUNDERMAPS_API_KEY);
  var abuseChannelId  = "5357" // Parking Abuse Reporting Channel
  var receivedStateId = 11740;
  var sampleReportId  = 29224663;
  var sampleReportId2 = 29330404
  var reportRange     = "reports=10-15";
  var userRange       = "users=10-15"
  var sampleUser      = 18884;

  // FUNCTIONS
  // Callbacks
  function printResponseBody(res) {
    console.log(JSON.parse(res.body));
  }
  function printHeaders(res) {
    console.log("Content-Range: "+res.headers['content-range']);
    console.log(JSON.parse(res.body));

  }

  
  describe('getAlertAreas()', function() {
    it('should return alert area for user "Peter (Admin)"', function(done) {

      tm.getAlertAreas(function(res){
        
        var expected = JSON.stringify([{"id":16834,"shape_type":"poly","radius":null,"area":"POLYGON ((-176.3141984173999 -43.6100218734608, -175.98887116881917 -43.837750947467306, -176.0767095258994 -44.60300783919361, -176.92418700868456 -44.14230010043468, -176.9615996421919 -43.70149301723657, -176.3141984173999 -43.6100218734608))","latitude":-44.0299932308183,"longitude":-176.439396776818},{"id":15364,"shape_type":"poly","radius":null,"area":"POLYGON ((172.24400879081736 -33.56126573723454, 179.78189105220576 -38.25014798405728, 168.56798817400477 -48.23950359264395, 164.79622073704127 -46.21231607168256, 173.355170720871 -39.5356597418809, 172.24400879081736 -33.56126573723454))","latitude":-41.3881625447274,"longitude":172.663112837221}]
        )
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });

    }).timeout(5000);
  })

  // ANALYTICS HERE

  
  describe('getChannels()', function() {
    it('should return list of all available channels');
    /*
    , function(done) {

      tm.getChannels(function(err,res,bod) {

        var expected = JSON.stringify(...);
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
    
    }).timeout(5000);
    */
  });


  describe('getChannel()', function() {
    it('should get a channel given a channel ID')/*, function(done) {
      
      tm.getChannel(abuseChannelId, function(res) {

        // TODO: "reports_count" is always changing. Can't 
        // just do an equality test
        var expected = JSON.stringify({
          "id": 5357,
          "additional_fields":[],
          "allow_public_comments": true,
          "allow_public_viewers": true,
          "allow_user_delete_own_reports": false,
          "category_id": 123141,
          "description": "Report abuse of mobility permit parks to be actioned by parking wardens",
          "is_reportable_by": true,
          "is_manageable_by": true,
          "logo":{
          "mini": "https://userfiles.thundermaps.com/paperclipped/libraries-logos/5357/mini-44dd48451dfeabad267e249331bccb4c3382f744.jpg",
          "small": "https://userfiles.thundermaps.com/paperclipped/libraries-logos/5357/small-99a8ce2a83ac65910be17a0f4bb70049f821c49c.jpg",
          "medium": "https://userfiles.thundermaps.com/paperclipped/libraries-logos/5357/medium-d5fe32bde427ff99a53ccf7f325f84e56b8620fb.jpg",
          "large": "https://userfiles.thundermaps.com/paperclipped/libraries-logos/5357/large-e6d55f2239a5814ed4dff5ded89fd6500c2ae44b.jpg",
          "huge": "https://userfiles.thundermaps.com/paperclipped/libraries-logos/5357/huge-1ba15ee2aab1864fa22bf3ef65ab3397f74be460.jpg"
          },
          "moderated": false,
          "name": "Parking Abuse Reporting",
          "slug": "special-access-carparks-test-channel-misuse",
          "reports_count": 2883,
          "form_locked": false
          });
        var actual = res.body; // or something..

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
    */
  });

  describe('getStates()', function() {
    it('should get a channel\'s report states list given a channel ID', function(done) {
      
      tm.getStates(abuseChannelId, function(res) {

        var expected = JSON.stringify([
          {
          "id": 11740,
          "name": "Thanks! Misuse report received!",
          "slug": "new",
          "position": 1,
          "loudness": "attention",
          "notify": "all",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": true,
          "default_assignee_id": 18884,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 20165,
          "name": "Private park abuse",
          "slug": "new-3",
          "position": 2,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 20164,
          "name": "Outside enforcement zone",
          "slug": "new-2",
          "position": 3,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "admins_only",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 30146,
          "name": "Parking services notified",
          "slug": "new-6",
          "position": 4,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 17447,
          "name": "Officer dispatched",
          "slug": "new-1",
          "position": 5,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 20162,
          "name": "Ticket issued",
          "slug": "resolved",
          "position": 6,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "admins_only",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 20673,
          "name": "Unenforceable",
          "slug": "new-5",
          "position": 7,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 20166,
          "name": "Abusers vehicle gone",
          "slug": "new-4",
          "position": 8,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 11742,
          "name": "Stored",
          "slug": "invisible",
          "position": 9,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "operators_and_admins",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          },
          {
          "id": 35328,
          "name": "Report rejected",
          "slug": "new-7",
          "position": 10,
          "loudness": "invisible",
          "notify": "none",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": null,
          "default_assignee_id": null,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          }
          ]);
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
  });

  describe('getState()', function() {
    it('should get a report state given channel and report state IDs', function(done) {
      
      tm.getState(abuseChannelId, receivedStateId, function(res) {

        var expected = JSON.stringify({
          "id": 11740,
          "name": "Thanks! Misuse report received!",
          "slug": "new",
          "position": 1,
          "loudness": "attention",
          "notify": "all",
          "timeout": 0,
          "visibility": "everyone",
          "editability": "admins_only",
          "assignable": true,
          "default_assignee_id": 18884,
          "assignment_due_timeout": 0,
          "assign_to_supervisor": false,
          "auto_archive": false,
          "account_id": 5357
          });
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
  });

  describe('getStateHistory()', function() {
    it('should getStateHistory', function(done) {
      
      tm.getStateHistory(sampleReportId, function(res) {

        var expected = JSON.stringify([
          {
          "id": 24585643,
          "change_location": "POINT (175.5927116 -40.337302099999995)",
          "change_time": "2018-08-27T17:57:30+12:00",
          "created_at": "2018-08-27T17:57:30+12:00",
          "new_report_state":{
          "id": 30146,
          "name": "Parking services notified"
          },
          "previous_report_state":{
          "id": 20164,
          "name": "Outside enforcement zone"
          },
          "report_id": 29224663,
          "user_id": 18884
          },
          {
          "id": 24585630,
          "change_location": "POINT (175.5927116 -40.337302099999995)",
          "change_time": "2018-08-27T17:57:03+12:00",
          "created_at": "2018-08-27T17:57:04+12:00",
          "new_report_state":{
          "id": 20164,
          "name": "Outside enforcement zone"
          },
          "previous_report_state":{
          "id": 20165,
          "name": "Private park abuse"
          },
          "report_id": 29224663,
          "user_id": 18884
          },
          {
          "id": 24585618,
          "change_location": "POINT (175.5927116 -40.337302099999995)",
          "change_time": "2018-08-27T17:56:51+12:00",
          "created_at": "2018-08-27T17:56:52+12:00",
          "new_report_state":{
          "id": 20165,
          "name": "Private park abuse"
          },
          "previous_report_state":{
          "id": 11740,
          "name": "Thanks! Misuse report received!"
          },
          "report_id": 29224663,
          "user_id": 18884
          }
          ]);
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
  });

  describe('getReports()', function() {
    it('should get some report given a channel ID and report range')/*, function(done) {
      
      tm.getReports(abuseChannelId, reportRange, function(err,res,bod) {

        var expected = JSON.stringify([
          {
          "id": 30293781
          },
          {
          "id": 30291159
          },
          {
          "id": 30282818
          },
          {
          "id": 30277714
          },
          {
          "id": 30261121
          },
          {
          "id": 30261120
          }
          ]);
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
    */
  });

  describe('getReport()', function() {
    it('should get a report given a report ID only')/*, function(done) {
      
      tm.getReport(sampleReportId, function(err,res,bod) {

        var expected = JSON.stringify({
          "id": 29224663,
          "account_id": 5357,
          "account_name": "Parking Abuse Reporting",
          "address": "Kaizen, Parumoana Street, Porirua, Wellington Region 5022, New Zealand",
          "assignee_id": null,
          "assignment_due_at": null,
          "category_id": 123141,
          "description": null,
          "is_anonymous": true,
          "iso_created_at": "2018-08-26T11:58:56+12:00",
          "location":{
          "latitude": -41.1316428,
          "longitude": 174.8390972
          },
          "report_state_id": 30146,
          "report_state_name": "Parking services notified",
          "shape_id": null,
          "title": "Parking Abuse Reporting",
          "form_fields":[
          {
          "id": 24499,
          "label": "<p><img alt=\"\" src=\"https://www.thundermaps.com/wp-content/uploads/2017/08/CCS-Disability-Action-CMYK-Landscape-1-300x145.jpg\" style=\"height:145px; width:300px\" /></p>\n\n<p>Your safety is important to us. Please do not place yourself at risk by engaging in unsafe behaviour&nbsp;in order to post on this channel. Be aware of&nbsp;moving vehicles&nbsp;and other immediate risks.</p>\n",
          "key": "f_4125_17_6",
          "field_type": "FreeText",
          "form_order": 0,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": null,
          "editable": true
          },
          {
          "id": 24491,
          "label": "<p>Mobility permit parks are essential for people with mobility issues,&nbsp;this is your opportunity make a difference and help create communities that include all people!</p>\n\n<p>Help us by reporting the abuse of mobility permits&nbsp;parks.</p>\n",
          "key": "f_4125_12_5",
          "field_type": "FreeText",
          "form_order": 1,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": null,
          "editable": true
          },
          {
          "id": 24489,
          "label": "Date & Time of misuse",
          "key": "f_4125_7_3",
          "field_type": "DateAndTime",
          "form_order": 2,
          "data":{
          "default_to_current": true
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "2018-08-26T11:59:00+12:00",
          "editable": true
          },
          {
          "id": 41289,
          "label": "Photos",
          "key": "f_4125_167_23",
          "field_type": "Image",
          "form_order": 3,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value":[
          {
          "id": 2369811,
          "original_url": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369811/original-1c6df046ec3be68d7306c0502aca2d524e1589e2.jpg_1535241644056",
          "filename": "20180826_115954.jpg_1535241644056",
          "style_url":{
          "thumb": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369811/thumb-460424afaa82f2f009967cdc2a9d27ae27336769.jpg_1535241644056",
          "medium": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369811/medium-66beb5af68f01a1612ad8a921e162cc485fb7361.jpg_1535241644056"
          },
          "photo_time": "2018-08-26T11:59:54",
          "photo_location": "POINT (-0.0 -0.0)"
          },
          {
          "id": 2369812,
          "original_url": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369812/original-a9e38c2d92cfc822842d6a1676cd4f1adeb9dcc4.jpg_1535241649524",
          "filename": "20180826_115950.jpg_1535241649524",
          "style_url":{
          "thumb": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369812/thumb-f164da17758c46e4a3f5a1433ed9ac1d14b3f037.jpg_1535241649524",
          "medium": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369812/medium-f852fecba05a98f9caa68c7cbef74cc412f7b277.jpg_1535241649524"
          },
          "photo_time": "2018-08-26T11:59:50",
          "photo_location": "POINT (-0.0 -0.0)"
          },
          {
          "id": 2369813,
          "original_url": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369813/original-cc8b8511a8b8221bb17681457374cbb19d74878e.jpg_1535241655298",
          "filename": "20180826_115944.jpg_1535241655298",
          "style_url":{
          "thumb": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369813/thumb-0e055db151abfa03d04b87452519cf49a3468255.jpg_1535241655298",
          "medium": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2369813/medium-0d57d4d9a38f125e180b609ec8b92ed33f97e01e.jpg_1535241655298"
          },
          "photo_time": "2018-08-26T11:59:44",
          "photo_location": "POINT (-0.0 -0.0)"
          }
          ],
          "editable": true
          },
          {
          "id": 24529,
          "label": "How is the car park being abused?",
          "key": "f_4125_74_17",
          "field_type": "DropDown",
          "form_order": 4,
          "data":{
          "multi_select": false,
          "options":[
          {
          "label": "No Permit",
          "value": "f_4125_74_17_76_10",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 0,
          "is_default": false
          },
          {
          "label": "Permit expired",
          "value": "f_4125_74_17_78_11",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 1,
          "is_default": false
          },
          {
          "label": "Other",
          "value": "f_4125_74_17_175_14",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 2,
          "is_default": false
          }
          ]
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "private",
          "value": "f_4125_74_17_76_10",
          "editable": true
          },
          {
          "id": 24536,
          "label": "If other, please describe",
          "key": "f_4125_138_21",
          "field_type": "ShortTextBox",
          "form_order": 5,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "",
          "editable": true
          },
          {
          "id": 24534,
          "label": "If it is safe to do so, make a note of the permit number if visible",
          "key": "f_4125_106_19",
          "field_type": "ShortTextBox",
          "form_order": 6,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "",
          "editable": true
          },
          {
          "id": 24500,
          "label": "If it is safe to do so, make note of the number plate of the vehicle involved below",
          "key": "f_4125_18_7",
          "field_type": "ShortTextBox",
          "form_order": 7,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "ELQ738",
          "editable": true
          },
          {
          "id": 37191,
          "label": "Is the park on public or privately owned land?",
          "key": "f_4125_159_22",
          "field_type": "DropDown",
          "form_order": 8,
          "data":{
          "multi_select": false,
          "options":[
          {
          "label": "Public (e.g. Street parking on public land)",
          "value": "f_4125_159_22_159_1",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 0,
          "is_default": false
          },
          {
          "label": "Private (e.g. Supermarket or private land)",
          "value": "f_4125_159_22_161_2",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 1,
          "is_default": false
          },
          {
          "label": "Not sure",
          "value": "f_4125_159_22_163_3",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 2,
          "is_default": false
          }
          ]
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "f_4125_159_22_159_1",
          "editable": true
          },
          {
          "id": 55424,
          "label": "Who owns the mobility park? (e.g. Countdown, New World)",
          "key": "f_4125_175_25",
          "field_type": "ShortTextBox",
          "form_order": 9,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "",
          "editable": true
          },
          {
          "id": 41744,
          "label": "Add any additional details here",
          "key": "f_4125_169_24",
          "field_type": "LongTextBox",
          "form_order": 10,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "It has been parked over the mobility ramp from road to pavement for at least an hour. Couldn't get my mother's wheelchair onto the pavement. It is a no parking space",
          "editable": true
          }
          ]
          });
        var actual = res.body; // or something..

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
    */
  });

  describe('getReport2()', function() {
    it('should get another report given a report ID')/*, function(done) {
      
      tm.getReport(sampleReportId2, function(err,res,bod) {

        var expected = JSON.stringify({
          "id": 29330404,
          "account_id": 5357,
          "account_name": "Parking Abuse Reporting",
          "address": "64 Paora Hapi Street, Taupo, Taupo 3330, New Zealand",
          "assignee_id": null,
          "assignment_due_at": null,
          "category_id": 123141,
          "description": null,
          "is_anonymous": true,
          "iso_created_at": "2018-08-29T19:38:45+12:00",
          "location":{
          "latitude": -38.6848906,
          "longitude": 176.0752073
          },
          "report_state_id": 20165,
          "report_state_name": "Private park abuse",
          "shape_id": null,
          "title": "Parking Abuse Reporting",
          "form_fields":[
          {
          "id": 24499,
          "label": "<p><img alt=\"\" src=\"https://www.thundermaps.com/wp-content/uploads/2017/08/CCS-Disability-Action-CMYK-Landscape-1-300x145.jpg\" style=\"height:145px; width:300px\" /></p>\n\n<p>Your safety is important to us. Please do not place yourself at risk by engaging in unsafe behaviour&nbsp;in order to post on this channel. Be aware of&nbsp;moving vehicles&nbsp;and other immediate risks.</p>\n",
          "key": "f_4125_17_6",
          "field_type": "FreeText",
          "form_order": 0,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": null,
          "editable": true
          },
          {
          "id": 24491,
          "label": "<p>Mobility permit parks are essential for people with mobility issues,&nbsp;this is your opportunity make a difference and help create communities that include all people!</p>\n\n<p>Help us by reporting the abuse of mobility permits&nbsp;parks.</p>\n",
          "key": "f_4125_12_5",
          "field_type": "FreeText",
          "form_order": 1,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": null,
          "editable": true
          },
          {
          "id": 24489,
          "label": "Date & Time of misuse",
          "key": "f_4125_7_3",
          "field_type": "DateAndTime",
          "form_order": 2,
          "data":{
          "default_to_current": true
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "2018-08-29T19:37:00+12:00",
          "editable": true
          },
          {
          "id": 41289,
          "label": "Photos",
          "key": "f_4125_167_23",
          "field_type": "Image",
          "form_order": 3,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value":[
          {
          "id": 2372886,
          "original_url": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2372886/original-b49abbff50b091e7869e641d5ae0112c76bf397f.jpg_1535528264661",
          "filename": "20180829_193654.jpg_1535528264661",
          "style_url":{
          "thumb": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2372886/thumb-4d532e69490f5b611116ba8864ee59e55056c2f4.jpg_1535528264661",
          "medium": "https://userfiles.thundermaps.com/paperclipped/incident_report_images-attachments/2372886/medium-f8d54bb49978663062240863020eb0e4ee0d65eb.jpg_1535528264661"
          },
          "photo_time": "2018-08-29T19:36:54",
          "photo_location": null
          }
          ],
          "editable": true
          },
          {
          "id": 24529,
          "label": "How is the car park being abused?",
          "key": "f_4125_74_17",
          "field_type": "DropDown",
          "form_order": 4,
          "data":{
          "multi_select": false,
          "options":[
          {
          "label": "No Permit",
          "value": "f_4125_74_17_76_10",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 0,
          "is_default": false
          },
          {
          "label": "Permit expired",
          "value": "f_4125_74_17_78_11",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 1,
          "is_default": false
          },
          {
          "label": "Other",
          "value": "f_4125_74_17_175_14",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 2,
          "is_default": false
          }
          ]
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "private",
          "value": null,
          "editable": true
          },
          {
          "id": 24536,
          "label": "If other, please describe",
          "key": "f_4125_138_21",
          "field_type": "ShortTextBox",
          "form_order": 5,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "",
          "editable": true
          },
          {
          "id": 24534,
          "label": "If it is safe to do so, make a note of the permit number if visible",
          "key": "f_4125_106_19",
          "field_type": "ShortTextBox",
          "form_order": 6,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "No permit",
          "editable": true
          },
          {
          "id": 24500,
          "label": "If it is safe to do so, make note of the number plate of the vehicle involved below",
          "key": "f_4125_18_7",
          "field_type": "ShortTextBox",
          "form_order": 7,
          "data":{},
          "mandatory": false,
          "visibility": "private",
          "field_visibility": "public",
          "value": "DKC183",
          "editable": true
          },
          {
          "id": 37191,
          "label": "Is the park on public or privately owned land?",
          "key": "f_4125_159_22",
          "field_type": "DropDown",
          "form_order": 8,
          "data":{
          "multi_select": false,
          "options":[
          {
          "label": "Public (e.g. Street parking on public land)",
          "value": "f_4125_159_22_159_1",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 0,
          "is_default": false
          },
          {
          "label": "Private (e.g. Supermarket or private land)",
          "value": "f_4125_159_22_161_2",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 1,
          "is_default": false
          },
          {
          "label": "Not sure",
          "value": "f_4125_159_22_163_3",
          "enabled": true,
          "multi_option_id": null,
          "display_order": 2,
          "is_default": false
          }
          ]
          },
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "f_4125_159_22_161_2",
          "editable": true
          },
          {
          "id": 55424,
          "label": "Who owns the mobility park? (e.g. Countdown, New World)",
          "key": "f_4125_175_25",
          "field_type": "ShortTextBox",
          "form_order": 9,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": "The warehouse",
          "editable": true
          },
          {
          "id": 41744,
          "label": "Add any additional details here",
          "key": "f_4125_169_24",
          "field_type": "LongTextBox",
          "form_order": 10,
          "data":{},
          "mandatory": false,
          "visibility": "public",
          "field_visibility": "public",
          "value": null,
          "editable": true
          }
          ]
          });
        var actual = res.body;

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
    */
  });

  describe('getUsers()', function() {
    it('should get a user list given a channel ID and user range')/*, function(done) {
      
      tm.getUsers(abuseChannelId, userRange, function(err,res,bod) {

        var expected = "";
        var actual = res.body; // or something..

        assert.equal(expected, actual);
        done();
      });
      
    }).timeout(5000);
    */
  });

  describe('getUser()', function() {
    it('should geta user given channel and user IDs')/*, function(done) {
      tm.getUser(abuseChannelId, sampleUser), function(err,res,bod) {

        var expected = "";
        var actual = res.body; // or something..

        assert.equal(expected, actual);
        done();
      }
  
    }).timeout(5000);
    */
  });  
});
