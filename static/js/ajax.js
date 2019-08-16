/**
 * AJAX requester
 */

// Function called when select value is changed
$('select').change(function() {
  const region = $('select.region').val().toLowerCase();
  const year = $('select.year').val();
  const month = $('select.month').val();
  if (region !== null && year !== null && month !== null) {
    populate(year, month, region);
  }
});


/**
  *
  * @param {*} year
  * @param {*} month
  * @param {*} region
  */
function populate(year, month, region) {
  const yearStr = String(year) + '/';
  const monthStr = (month<10 ? '0'+month : month) + '/';
  // const baseUrl = '/static/gen/ccs/' + yearStr + monthStr;
  const url = '/ajax/'+yearStr+monthStr+region+'/';

  updateHtml(url);
};

/**
 *
 * @param {*} url
 */
function updateHtml(url) {
  $.ajax({
    url: url,
    success: function(html) {
      console.log('Got the data!');
      // console.log(html);

      $('.results').empty().append(html);
    },
    error: function(data) {
      console.log('AJAX failed.');
      console.log(data);
    },
  });
}


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
