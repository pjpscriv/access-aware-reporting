/**
 *
 */
function drawCharts() {
  // Select chart divs
  const fraction = new google.visualization.PieChart(
      document.getElementById('fraction_chart'));
  const pub_priv = new google.visualization.PieChart(
      document.getElementById('pub_priv_private_chart'));
  const states = new google.visualization.PieChart(
      document.getElementById('state_chart'));
  const regions = new google.visualization.PieChart(
      document.getElementById('areas_chart'));

  // Create the data table.
  const fraction_data = new google.visualization.arrayToDataTable([
      ["Name","Number"],["Rotorua",10],["Rest",2757]
  ]);
  const pub_priv_data = new google.visualization.arrayToDataTable([
      ["Category","Amount"],["Private",3],["Public",3],["Not sure",4]
  ]);
  const states_data = new google.visualization.arrayToDataTable([
      ["Category","Amount"],["Private park",3],["Stored",1],["Outside enforcement zone",6]
  ]);
  const regions_data = new google.visualization.arrayToDataTable([
      ["Category","Amount"],["Yo",43],["Yo",43],["Yo",43]
  ]);

  // Set chart options
  var options = {
      'height': 400,
      'legend': 'top'
  }
  var fraction_options = {
      //'title' : 'Abuse Reports'
  };
  var pub_priv_options   = {
      //'title' : 'Private / Public Abuses'
  };
  var states_options   = {
      //'title' : 'Abuse Report States'
  };
  var regions_options  = {
      //'title' : 'Reports Over Time'
  };
  
  // Draw chart, passing in some options.
  fraction.draw(fraction_data, options);
  pub_priv.draw(pub_priv_data, options);
  states.draw(states_data, options);
  regions.draw(regions_data, options);
}

window.addEventListener('resize', function(event){
    drawCharts();
    console.log(window.innerWidth);
});

window.addEventListener('load', function(event){
    google.charts.load("current", {"packages":["corechart"]});
    google.charts.setOnLoadCallback(drawCharts);
});
