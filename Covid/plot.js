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
    document.getElementsByClassName("input-group")[0].innerHTML = "";

    //get data
    states = Object.keys(allMyData.US);

    //draw dropdown title
    d3.select(".input-group")
        .append("div")
        .attr("class", "input-group-prepend");
    d3.select(".input-group-prepend")
        .append("label")
        .attr("class", "input-group-text")
        .attr("for", "inputGroupSelect01")
        .text("Pick a location:");


    //draw select dropdown
    var sel = d3.select(".input-group")
        .append("select")
        .text("pick a state")
        .attr("id", "inputGroupSelect01")
        .attr("class", "custom-select")
        .attr("onchange", "drawCountySelect(this.value)");

    //draw default
    var defaultOption = d3.select("#inputGroupSelect01")
        .append("option")
        .text("pick a state")
        .attr("id", "option-description")
        .attr("disabled", "True");





    // add all options
    var stateSelect = document.getElementById('inputGroupSelect01');
    for (var i = 0; i < states.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = states[i];
        opt.value = states[i];
        stateSelect.appendChild(opt);



        /*  <div class = "input-group mb-3" >
             <div class = "input-group-prepend" >
             <label class = "input-group-text" for = "inputGroupSelect01" > Options 
             </label> 
             </div> 
             <select class = "custom-select" id = "inputGroupSelect01" >
             <option selected > Choose... < /option> 
             <option value = "1" > One < /option> 
             <option value = "2" > Two < /option> 
             <option value = "3" > Three < /option> 
             </select> 
             </div> */


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
        /* if (!document.getElementById('countySelect')) { */
        var countySelect = d3.select(".input-group")
            .append("select")
            .text("pick a county")
            .attr("id", "countySelect")
            .attr("class", "custom-select")
            .attr("onchange", "myFunction(this.value)");
        /* } */
        //console.log(allMyData.US[state]);
        counties = Object.keys(allMyData.US[state]);

        var countySelect = document.getElementById('countySelect');
        //clear any old data
        countySelect.innerHTML = "";

        //draw default
        var defaultOption = d3.select("#countySelect")
            .append("option")
            .text("pick a county")
            .attr("value", "")
            .attr("id", "option-description")
            .attr("disabled", "True");



        for (var i = 0; i < counties.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = counties[i];
            opt.value = counties[i];
            countySelect.appendChild(opt);
        }




    } else {
        document.getElementById('countySelect').remove();
        document.getElementById('dataSelect').remove();
        document.getElementById('plot').remove();

    }


}

////////////////////////////////////////////////////////////////////////////

function myFunction(thisCounty) {
    county = thisCounty;
    buildPlot("confirmed_7_day");
    console.log("line 172");
    drawDataSelect(thisCounty);


};



function drawDataSelect(theCounty) {
    //get data
    county = theCounty;
    console.log("drawDataSelect keys for " + county + ' ' + state);
    console.log(county);
    console.log(Object.keys(allMyData.US[state][county]));

    if (county) {
        //clear plot
        /* if (document.getElementById('plot')) {
            document.getElementById('plot').remove()
        }; */

        //create county select tag
        if (!document.getElementById('dataSelect')) {
            var dataSelect = d3.select(".input-group")
                .append("select")
                .text("pick a dataset")
                .attr("id", "dataSelect")
                .attr("class", "custom-select")
                .attr("onchange", "buildPlot(this.value)");
        }

        //
        dataChoices = Object.keys(allMyData.US[state][county]);

        var dataSelect = document.getElementById('dataSelect');

        //clear any old data
        dataSelect.innerHTML = "";
        console.log("line 209");
        //draw default
        var defaultOption = d3.select("#dataSelect")
            .append("option")
            .text("pick a dataset")
            .attr("value", "")
            .attr("id", "option-description")
            .attr("disabled", "True");



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
    console.log("line 240");
    dataSetChoice = dataChoice;

    d3.select("body")
        .append("div")
        .attr("id", "plot");

    county = document.getElementById('countySelect').value
    var name = county + ' ' + state + ' ' + dataSetChoice;
    console.log(state);
    console.log(county);
    console.log(Object.keys(allMyData.US[state][county]));
    //console.log(allMyData.US[state][county].dates.map(d3.timeParse("%-m/%-d/%y")));
    var dates = allMyData.US[state][county].dates.map(d3.timeParse("%-m/%-d/%y"));
    var plotData = allMyData.US[state][county][dataSetChoice];

    var trace1 = {
        type: "bar",
        //mode: "lines",
        name: name,
        x: dates,
        y: plotData,
        //line: {
        //    color: "#17BECF"
        //}
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