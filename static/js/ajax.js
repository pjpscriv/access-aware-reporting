/**
 * AJAX requester
 */

// Function called when select value is changed
$('select').change(function() {
  const region = $('select.region').val().toLowerCase();
  const year = $('select.year').val();
  const month = $('select.month').val();
  if (region !== null && year !== null && month !== null) {
    populate(region, year, month);
  }
});


/**
 * Takes a region, year, month. Requests new html from server. Inserts that
 * html into page.
 *
 * @param {*} region
 * @param {*} year
 * @param {*} month
 */
function populate(region, year, month) {
  const yearStr = '/' + String(year);
  const monthStr = '/' + (month<10 ? '0'+month : month);
  const url = '/ajax/'+region+yearStr+monthStr+'/';
  // Do Ajax
  $.ajax({
    url: url,
    success: function(html) {
      console.log('Got the data!');
      $('.results').empty().append(html);
    },
    error: function(data) {
      console.log('AJAX failed.');
      console.log(data);
    },
  });
};


$('get-csv').click(function() {
  getCsv();
});

/**
 * Download a csv file.
 * @param {*} baseUrl
 * @param {*} region
 */
function getCsv(baseUrl, region) {
  const url = baseUrl+'csv/'+region+'.csv';
  $.ajax({
    url: url,
    success: function(data) {
      console.log('Got the data!');
      console.log(data);
    },
    error: function(data) {
      console.log('failed.');
    },
  });
};

/**
 *
 * @param {*} baseUrl
 * @param {*} region
 */
// function getHtml(baseUrl, region) {
//   const url = baseUrl+'html/'+region+'_gm.html';
//   $.ajax({
//     url: url,
//     success: function(data) {
//       console.log('Got the data!');
//       console.log(data);
//     },
//     error: function(data) {
//       console.log('failed.');
//     },
//   });
// };
