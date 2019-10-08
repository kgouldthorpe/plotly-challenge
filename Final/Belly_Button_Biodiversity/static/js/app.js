function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var md_sample = d3.select("#sample-metadata").html("");
    var md_url = "/metadata/${sample}";

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(md_url).then(function(sample_data){
      list = Object.enteries(sample_data);
      console.log(list);
      list.forEach((item => {md_sample.append("p").text(item[0]+ ": " + item[1]);}));
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_data = d3.select('#pie').html("");
  var sample_url = '/samples/${sample}';
  d3.json(sample_url).then((data => {
    data.values.forEach(values => parseInt(values));
    
    var ids_list = sample_data["otu_ids"];
    var labels_list = sample_data["otu_labels"];
    var sample_values = sample_data["sample_values"];
    var combo = [sample_values, labels_list, ids_list];
    //Transpose
    var new_data = combo[0].map(function(col, i){
      return combo.map(function(row){
        return row[i]
      });
    });
    // Sort
    new_data.sort(function(a, b){
      return b[0] - a[0];
    });
      
  // copy this at the end of build }))
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = [{
      type: "bubble"
      x: ids_list,
      y: sample_values,
      text: labels_list,
      mode: "markers",
      marker: {size: sample_values, color: ids_list, colorscale: "viridis"}
    }];

    var bubble_layout = {
      height: 600,
      width: 1200,
      sizemode: "area",
      hovermode: "closet"
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", trace1, bubble_layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var top_ten = new_data.slice(0,10);
    var pie_data = top_ten[0].map(function(col, i){
      return top_ten.map(function(row){
        return row[i];
      });
    });

    var trace2 = [{
      type: "pie",
      values: pie_data[0],
      labels: pie_data[2],
      hovertext: pie_data[1],
      hoverinfo: "hovertext",
      colorscale: "viridis"
    }];

    var pie_layout = {
      height: 500,
      width: 500
    };

    Plotly.newPlot("pie", trace2, pie_layout);
  }));  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
