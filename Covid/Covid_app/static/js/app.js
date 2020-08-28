function optionChanged(value) {
    Charts(value);
    buildTable(value);
}

function Charts(id) {
    d3.json("./static/js/samples.json").then((importedData) => {
        var filteredData = importedData.samples.filter(item => item.id === id);

        var sampleValues = filteredData[0].sample_values;
        var otuIds = filteredData[0].otu_ids;
        var otuLabels = filteredData[0].otu_labels;

        var filteredData = importedData.metadata.filter(item => item.id === parseInt(id));
        var wfreq = filteredData[0].wfreq;
        console.log(wfreq);
        // console.log(`otuIds: ${otuIds}`);
        // console.log(`Labels: ${otuLabels}`);
        // console.log(`Values are: ${sampleValues}`);

        var otuIDsText = [];

        for (var i = 0; i < otuIds.length; i++) {
            var result = 'OTU ' + `${otuIds[i]}`
            otuIDsText.push(result);
        };
        var trace1 = {
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIDsText.slice(0, 10).reverse(),
            type: 'bar',
            marker: {
                color: 'rgba(50,171,96,0.6)',
                line: {
                    color: 'rgba(50,171,96,1.0)',
                    width: 1
                }
            },
            orientation: "h",
            text: otuLabels
        };

        var layout1 = {
            xaxis: {
                range: [0, 200],
                //   domain: [0, 10],
                zeroline: false,
                showline: false,
                showticklabels: true,
                showgrid: true
            },
            margin: {
                l: 100,
                r: 20,
                t: 50,
                b: 50
            },
            // width: 600,
            // height: 600,
            paper_bgcolor: 'rgb(250,250,240)',
            plot_bgcolor: 'rgb(248,248,255)',
        };

        var data1 = [trace1];

        var markerSizes = [];

        for (var i = 0; i < sampleValues.length; i++) {
            markerSizes.push(sampleValues[i] * 30);
        };

        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: markerSizes,
                sizemode: 'area',
                color: otuIds
            }
        };
        var layout2 = {
            xaxis: {
                showgrid: true,
                title: 'OTU IDs'
            },
            margin: {
                l: 100,
                r: 50,
                t: 50,
                b: 80
            },
            width: 1000,
            height: 500,
            paper_bgcolor: 'rgb(250,250,240)',
            plot_bgcolor: 'rgb(248,248,295)',
        };

        Plotly.newPlot("bar", data1, layout1);

        var data2 = [trace2];

        Plotly.newPlot("bubble", data2, layout2);

        var data3 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Scrubs per Week", font: { size: 18 } },
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 5 },
            gauge: {
                axis: { range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                // bgcolor: "white",
                borderwidth: 1,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: "gray" },
                    { range: [1, 2], color: "lightgray" },
                    { range: [2, 3], color: "beige" },
                    { range: [3, 4], color: "lightblue" },
                    { range: [4, 5], color: "skyblue" },
                    { range: [5, 6], color: "lightgreen" },
                    { range: [6, 7], color: "yellowgreen" },
                    { range: [7, 8], color: "yellow" },
                    { range: [8, 9], color: "orange" },
                    { range: [9, 10], color: "red" },
                ]
            }
        }];

        var layout3 = { width: 450, height: 300, paper_bgcolor: 'rgb(248,248,295)', margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data3, layout3);
    });
}

function buildPlot() {

    d3.json("./static/js/counties.json").then((importedData) => {

        var counties = importedData.California;
        console.log(counties);
        var selectedName = d3.select("#selDataset");
        counties.forEach((name => {
            selectedName.append("option").text(name).property("value", name)
        }));

        var id = names[0];
        // console.log(id);
        Charts(id);

        buildTable(id);

    });
}

buildPlot();

function buildTable(id) {
    d3.json("./static/js/samples.json").then((importedData) => {
        var TableData = importedData.metadata.filter(item => item.id === parseInt(id));

        var table = d3.select("#summary-list");
        var tlist = table.select("li");
        tlist.html("");
        var listitem;
        listitem = tlist.append("li").text(`ID: ${TableData[0].id}`);
        listitem = tlist.append("li").text(`Age: ${TableData[0].age}`);
        listitem = tlist.append("li").text(`Ethnicitiy: ${TableData[0].ethnicity}`);
        listitem = tlist.append("li").text(`Gender: ${TableData[0].gender}`);
        listitem = tlist.append("li").text(`Location: ${TableData[0].location}`);
        listitem = tlist.append("li").text(`BB_Type: ${TableData[0].bbtype}`);
        listitem = tlist.append("li").text(`Wfreq: ${TableData[0].wfreq}`);

    });
}