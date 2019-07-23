function drawCharts() {

    // Select chart divs
    var fraction = new google.visualization.PieChart(document.getElementById('fraction_chart'));
    var public = new google.visualization.PieChart(document.getElementById('public_private_chart'));
    var states = new google.visualization.PieChart(document.getElementById('state_chart'));
    var regions = new google.visualization.PieChart(document.getElementById('areas_chart'));

    // Create the data table.
    var fraction_data = new google.visualization.arrayToDataTable([
        ["Name","Number"],["Rotorua",10],["Rest",2757]
    ]);
    var public_data = new google.visualization.arrayToDataTable([
        ["Category","Amount"],["Private",3],["Public",3],["Not sure",4]
    ]);
    var states_data = new google.visualization.arrayToDataTable([
        ["Category","Amount"],["Private park",3],["Stored",1],["Outside enforcement zone",6]
    ]);
    var regions_data = new google.visualization.arrayToDataTable([
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
    var public_options   = {
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
    public.draw(public_data, options);
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
