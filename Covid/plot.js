// Prevent the page from refreshing
//d3.event.preventDefault();




var country = "US";
var state = "";
var county = "";
var url = `data.json`;
var xArr = [];
var yArr = [];
var allMyData = {};
var states = [];
var dataChoice = "";
var dataSetChoice = "";

function getData() {
    d3.json(url).then(function(data) {
        allMyData = data;
        console.log(allMyData);
        drawStateSelect(); //data must be fully loaded before this.
    });


}



///////////////////////////////////////////////////////////////////////////////////




// draw state select

function drawStateSelect() {
    // start with clear page:
    document.getElementById("selectBoxes").innerHTML = "";

    //get data
    states = Object.keys(allMyData.US);

    //draw select dropdown
    var sel = d3.select("#selectBoxes")
        .append("select")
        .text("pick a state")
        .attr("id", "stateSelect")
        .attr("onchange", "drawCountySelect(this.value)");

    //draw default
    var defaultOption = d3.select("#stateSelect")
        .append("option")
        .text("pick a state")
        .attr("value", "");

    var stateSelect = document.getElementById('stateSelect');
    for (var i = 0; i < states.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = states[i];
        opt.value = states[i];
        stateSelect.appendChild(opt);
    }


}



////////////////////////////////////////////////////////////////////////////



function drawCountySelect(theState) {
    //get data
    state = theState;
    console.log(state);
    console.log(Object.keys(allMyData.US[state]))

    if (theState) {
        //clear plot
        if (document.getElementById('plot')) {
            document.getElementById('plot').remove()
        };
        if (document.getElementById('dataSelect')) {
            document.getElementById('dataSelect').remove()
        };
        if (document.getElementById('countySelect')) {
            document.getElementById('countySelect').remove()
        };

        //create county select tag
        if (!document.getElementById('countySelect')) {
            var countySelect = d3.select("#selectBoxes")
                .append("select")
                .text("pick a county")
                .attr("id", "countySelect")
                .attr("onchange", "drawDataSelect(this.value)");
        }
        //console.log(allMyData.US[state]);
        counties = Object.keys(allMyData.US[state]);

        var countySelect = document.getElementById('countySelect');
        //clear any old data
        countySelect.innerHTML = "";

        //draw default
        var defaultOption = d3.select("#countySelect")
            .append("option")
            .text("pick a county")
            .attr("value", "");

        for (var i = 0; i < counties.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = counties[i];
            opt.value = counties[i];
            countySelect.appendChild(opt);
        }

        //county = document.getElementById('countySelect').nodeValue


    } else {
        document.getElementById('countySelect').remove();
        document.getElementById('dataSelect').remove();
        document.getElementById('plot').remove();

    }
}

////////////////////////////////////////////////////////////////////////////



function drawDataSelect(theCounty) {
    //get data
    county = theCounty;
    console.log("drawDataSelect keys for " + county + ' ' + state);
    console.log(Object.keys(allMyData.US[state][county]))

    if (county) {
        //clear plot
        if (document.getElementById('plot')) {
            document.getElementById('plot').remove()
        };

        //create county select tag
        if (!document.getElementById('dataSelect')) {
            var dataSelect = d3.select("#selectBoxes")
                .append("select")
                .text("pick a dataset")
                .attr("id", "dataSelect")
                .attr("onchange", "buildPlot(this.value)");
        }

        //
        dataChoices = Object.keys(allMyData.US[state][county]);

        var dataSelect = document.getElementById('dataSelect');

        //clear any old data
        dataSelect.innerHTML = "";

        //draw default
        var defaultOption = d3.select("#dataSelect")
            .append("option")
            .text("pick a dataset")
            .attr("value", "");

        //draw options
        for (var i = 0; i < dataChoices.length; i++) {
            console.log(dataChoices[i].toString())
            if (["deaths", "confirmed", "confirmed_7_day"].includes(dataChoices[i])) {
                var opt = document.createElement('option');
                opt.innerHTML = dataChoices[i];
                opt.value = dataChoices[i];
                dataSelect.appendChild(opt)
            }
        }



    } else {
        document.getElementById('dataSelect').remove();
        document.getElementById('plot').remove();

    }
}

//////////////////////////////////////////////////////////////

function buildPlot(dataChoice) {
    // 

    dataSetChoice = dataChoice;

    d3.select("body")
        .append("div")
        .attr("id", "plot");

    county = document.getElementById('countySelect').value
    var name = county + ' ' + state + ' ' + dataSetChoice;
    console.log(state)
    console.log(county)
    console.log(Object.keys(allMyData.US[state][county]))
        //console.log(allMyData.US[state][county].dates.map(d3.timeParse("%-m/%-d/%y")));
    var dates = allMyData.US[state][county].dates.map(d3.timeParse("%-m/%-d/%y"));
    var plotData = allMyData.US[state][county][dataSetChoice];

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: name,
        x: dates,
        y: plotData,
        line: {
            color: "#17BECF"
        }
    };

    var data = [trace1];

    var layout = {
        title: `${name}`,
        xaxis: {
            autorange: true,

            range: d3.extent(trace1.x),
            type: "date"
        },
        yaxis: {
            autorange: true,
            type: "linear"
        }
    };

    Plotly.newPlot("plot", data, layout);

    /* 

        // Add event listener for submit button
        //d3.select("#submit").on("click", handleSubmit);

        d3.selectAll("selDataset").on("change", updateCounties);
     */

}


/////////////////////////////////////////////////////////////////////////////

getData();