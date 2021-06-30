// 1. Use the D3 library to read in samples.json.

// Fetch the JSON data and console log it


//define directory to samples
const dir = "./samples.json";

// Fetch the JSON data and console log it
const dataPromise = d3.json(dir);

dataPromise.then(function(data) {
    console.log(data);
//defining variables for checking

    var metadata = data.metadata;
    var names = data.names;
    var samples = data.samples;

//console check
    console.log(metadata);
    // console.log(names);
    // console.log(samples);

});


// 2. Create a horizontal bar chart with a dropdown menu 
// to display the top 10 OTUs found in that individual


// Initializes the page with a default plot

function init() {
    dataPromise.then(function(data) {
    //define variable to draw data from    
    var samples = data.samples;

// Use sample_values as the values for the bar chart.
    var sample_values = samples.map(value => value.sample_values)
    var topSamples = sample_values[0].slice(0,10).reverse();    
    console.log(topSamples);

// Use otu_ids as the labels for the bar chart.
    var otu_ids = samples.map(value => value.otu_ids)
    var topIds = otu_ids[0].slice(0,10).reverse();
    var topIds = topIds.map(value =>`OTU ${value}`)
    console.log(topIds);

// Use otu_labels as the hovertext for the chart.
    var otu_labels = samples.map(value => value.otu_labels)
    var topLabels = otu_labels[0].slice(0,10).reverse();
    console.log(topLabels);

// Create a horizontal bar chart
    var trace1 = {
        x: topSamples,
        y: topIds,
        text: topLabels,
        orientation: "h",
        type: 'bar'
    };

// data variable for plot    
    var newdata = [trace1];
// layout for plot    
    var layout = {
        title: `Top 10 OTUs For Subject ${samples.map(value => value.id)[0]}`,
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 30,
            b: 20
        }
    }
    Plotly.newPlot("bar",newdata, layout)


    var trace1 = {
        x: otu_ids[0],
        y: sample_values[0],
        mode: "markers",
        marker: {
            size: sample_values[0],
            color: otu_ids[0]
        },
        text: otu_labels[0]

    };

    // set the layout for the bubble plot
    var layout = {
        xaxis:{title: `OTU IDs For Subject ${samples.map(value => value.id)[0]}`},
        height: 600,    
        width: 1300
    };

    // create the data variable 
    var newdata = [trace1];

    // create the bubble plot
    Plotly.newPlot("bubble", newdata, layout); 

//*********  Display the sample metadata **********
//*************************************************** */
    // create function for filter 
    function subjectID(subject) {
        return subject.id == samples.map(value => value.id)[0];
      }

    //applied filter to match IDs from dropdown menu
    var metadata = data.metadata.filter(subjectID);
    console.log(metadata)

    d3.select("#sample-metadata")
        .text(`id : ${metadata.map(value => value.id)}`)
        .append("p")
        .text(`ethnicity : ${metadata.map(value => value.ethnicity)}`)
        .append("p")
        .text(`gender : ${metadata.map(value => value.gender)}`)
        .append("p")
        .text(`age : ${metadata.map(value => value.age)}`)
        .append("p")
        .text(`location : ${metadata.map(value => value.location)}`)
        .append("p")
        .text(`bbtype : ${metadata.map(value => value.bbtype)}`)
        .append("p")
        .text(`wfreq : ${metadata.map(value => value.wfreq)}`);
    });
};


// create a dynamic dropdown menu for each subject
dataPromise.then(function(data) {

    var names = data.names;

    // for loop to append on subject ids options onto the select element  
    for (var j = 0; j < names.length; j++) {
        d3.select("#selDataset")
            .append("option")
            .attr("value", names[j])
            .text(names[j]);
      }

});

// let chart change from dropdown menu 

// // Call updatePlotly() when a change takes place to the DOM


function optionChanged() {
    dataPromise.then(function(data) {

    //define variable to draw data from 
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var menuId = dropdownMenu.property("value");   
    
    console.log(menuId)

    // create function for filter 
    function subjectID(subject) {
        return subject.id == menuId;
      }
    // filter to get sample row with ID equal to menu ID  
    var samples = data.samples.filter(subjectID);

    console.log(samples)
// Use sample_values as the values for charts.
    var sample_values = samples.map(value => value.sample_values)
    //Top 10 values
    var topSamples = sample_values[0].slice(0,10).reverse();    
    console.log(topSamples);

// Use otu_ids as the labels for charts.
    var otu_ids = samples.map(value => value.otu_ids)
    //Ids of Top 10 values   
    var topIds = otu_ids[0].slice(0,10).reverse();
    var topIds = topIds.map(value =>`OTU ${value}`)
    console.log(topIds);

// Use otu_labels as the hovertext for charts.
    var otu_labels = samples.map(value => value.otu_labels)
    //Labels for Top 10 values  
    var topLabels = otu_labels[0].slice(0,10).reverse();
    console.log(topLabels);

// ****** Create a horizontal bar chart ***********
//************************************************* */
    var trace1 = {
        x: topSamples,
        y: topIds,
        text: topLabels,
        orientation: "h",
        type: 'bar'
    };

// data variable for plot    
    var newdata = [trace1];

// layout for plot    
    var layout = {
        title: `Top 10 OTUs For Subject ${menuId}`,
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 30,
            b: 20
        }
    }
    Plotly.newPlot("bar",newdata, layout)


 //*********  Create a bubble chart that displays each sample. **********
//********************************************************************** */
    var trace1 = {
        x: otu_ids[0],
        y: sample_values[0],
        mode: "markers",
        marker: {
            size: sample_values[0],
            color: otu_ids[0]
        },
        text: otu_labels[0]

    };

    // set the layout for the bubble plot
    var layout = {
        xaxis:{title: `OTU IDs For Subject ${menuId}`},
        height: 600,    
        width: 1300
    };

    // create the data variable 
    var newdata = [trace1];

    // create the bubble plot
    Plotly.newPlot("bubble", newdata, layout); 


 //*********  Display the sample metadata **********
//*************************************************** */

//Display each key-value pair from the 
//metadata JSON object somewhere on the page.

// delete previous metadata

    //applied filter to match IDs from dropdown menu
    var metadata = data.metadata.filter(subjectID);
    console.log(metadata)
    var metadataKeys = Object.keys(metadata[0])
    console.log(metadataKeys)
    var metadataValues = Object.values(metadata[0])
    console.log(metadataValues)
    var metadataEntries = Object.entries(metadata[0])
    console.log(metadataEntries)
    //appending paragraphs to fill with metadata
    d3.select("#sample-metadata")
        .text(`${metadataKeys[0]} : ${menuId}`)
        .append("p")
        .text(`${metadataKeys[1]} : ${metadataValues[1]}`)
        .append("p")
        .text(`${metadataKeys[2]} : ${metadataValues[2]}`)
        .append("p")
        .text(`${metadataKeys[3]} : ${metadataValues[3]}`)
        .append("p")
        .text(`${metadataKeys[4]} : ${metadataValues[4]}`)
        .append("p")
        .text(`${metadataKeys[5]} : ${metadataValues[5]}`)
        .append("p")
        .text(`${metadataKeys[6]} : ${metadataValues[6]}`);


 
            


    // var el = document.getElementById('metadata');
    // console.log(el)
    // el.remove();

    // for loop to add metadata on screen
        
    // for (var j = 0; j < metadataKeys.length; j++) {
    //     d3.select("#sample-metadata")
    //         .append("p")
    //         .attr("id", "metadata")
    //         .append("b")
    //         .text(`${metadataKeys[j]} : ${metadataValues[j]}`)
    //   }   

    });


    // let app = document.querySelector('#sample-metadata');

    // let nodes = metadataKeys.map(metadataKeys => {
    //     let p = document.createElement('p');
    //     p.textContent = metadataKeys;
    //     return p;
    // });

    // app.append(nodes);
};


init();

