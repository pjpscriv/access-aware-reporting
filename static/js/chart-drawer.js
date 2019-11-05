/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/**
 *
 */

google.charts.load('current', {'packages': ['corechart']});

/**
 *
 */
function drawCharts() {
  // Select chart divs
  const fraction = new google.visualization.PieChart(
      document.getElementById('fraction_chart'));
  const pubPriv = new google.visualization.PieChart(
      document.getElementById('pub_priv_private_chart'));
  const states = new google.visualization.PieChart(
      document.getElementById('state_chart'));
  const regions = new google.visualization.PieChart(
      document.getElementById('areas_chart'));

  // Create the data table.
  const fractionData = new google.visualization.arrayToDataTable([
    ['Name', 'Number'], ['Rotorua', 10], ['Rest', 2757],
  ]);
  const pubPrivData = new google.visualization.arrayToDataTable([
    ['Category', 'Amount'], ['Private', 3], ['Public', 3], ['Not sure', 4],
  ]);
  const statesData = new google.visualization.arrayToDataTable([
    ['Category', 'Amount'], ['Private park', 3], ['Stored', 1],
    ['Outside enforcement zone', 6],
  ]);
  const regionsData = new google.visualization.arrayToDataTable([
    ['Category', 'Amount'], ['Yo', 43], ['Yo', 43], ['Yo', 43],
  ]);

  // Set chart options
  const options = {
    'height': 400,
    'legend': 'top',
  };

  // Draw chart, passing in some options.
  fraction.draw(fractionData, options);
  pubPriv.draw(pubPrivData, options);
  states.draw(statesData, options);
  regions.draw(regionsData, options);
}

window.addEventListener('resize', function(event) {
  // drawCharts();
  // console.log(window.innerWidth);
});

window.addEventListener('load', function(event) {
  google.charts.load('current', {'packages': ['corechart']});
  // google.charts.setOnLoadCallback(drawCharts);
});
