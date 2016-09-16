//Detector info
var chartTitle = "Cosmic Ray Muon Flux";
//Global chart information variables
var chartData;
var chartOptions;
//Name and location of main file
var dataFile = "http://" + location.hostname + "/" + "twoPaddleData.log";
//Global rawData array [startTime,headerLines,data,span,buffer]
var rawData = [];

//Read in the text File, and kick off initial graphing
function readFile() {
    read(dataFile);
}

//Read the text file
function read(textFile) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', textFile);
    xhr.onload = processFile;
    xhr.send();
}

function processFile() {
    //First split the title from the file
    var dataSet = this.response.split("\n");
    //Store the start date string in 'startDate'
    var startDate = dataSet.shift().split("_");
    //Convert the date string to a unix timeStamp
    startDate = new Date(startDate[0], startDate[1] - 1, startDate[2], startDate[4], startDate[5], startDate[6]);
    //Removes counts before first hour
    if ((59 - startDate.getMinutes()) != 0) {
        var extras = 59 - startDate.getMinutes();
        for (var i = 0; i < extras; i++) {
            startDate.setTime(startDate.getTime() + 60000);
        }
    }
    //Strip the collumn header off, this is what will define the lines drawn
    var columnHeader = dataSet.shift().split(",");
    for (line in dataSet) {
        dataSet[line] = dataSet[line].split(",");
        for (counts in dataSet[line]) {
            dataSet[line][counts] = Number(dataSet[line][counts]);
        }
    }
    //Remove the last line as it may be incomplete
    dataSet.pop();
    //Custom graph function
    rawData[0] = startDate;
    rawData[1] = columnHeader;
    rawData[2] = dataSet;

    //---------------------------------------------
    //Here is where we get to manipulate the data
    //----------------------------------------------
    //Once you remove a collumn, its gone immedeatly
    removeCollumn(0);
    //So original collumn 5 becomes 4
    removeCollumn(4);
    //Average collums averages them, and then places them in 0
    averageCollumns([0, 1, 2, 3]);
    //And then just change the name, so it isnt refrenceing just one channel
    //We assume the knowlege that we started with 6 cahnnels, and one is left
    rawData[1][0] = "Counts";

    //Trigger spanBuffer changed, to update the shown values
    spanBufferChanged();
}

function removeCollumn(collumnNum) {
    //This is where we canremove lines we dont want to keep
    //Remove 1 element from index collumnNum
    rawData[1].splice(collumnNum, 1);
    //And do the same with every line line the data
    for (line in rawData[2]) {
        rawData[2][line].splice(collumnNum, 1);
    }
}

function averageCollumns(collumnsList) {
    //This will average the collum numbers given to it in a array
    for (line in rawData[2]) {
        var average = 0;
        for(collumn in collumnsList){
            average += rawData[2][line][collumn]
        }
        //And put it in the first items place
        rawData[2][line][collumnsList[0]] = average/collumnsList.length;
        average = 0;
    }
    //Now remove all the rest
    while(collumnsList.length > 1){
        removeCollumn(collumnsList.pop())
    }
}

function spanBufferChanged() {
    // Get the span and buffer value, set them in the html, and store in raw data
    //Convert buffer from hours to min, but show in hours
    rawData[3] = document.getElementById("span").value;
    rawData[4] = document.getElementById("buffer").value * 60;
    document.getElementById("spanValue").innerHTML = rawData[3];
    document.getElementById("bufferValue").innerHTML = rawData[4] / 60;
    //If there is a dataset loaded in, graph
    if (rawData[2] != undefined) {
        graph();
    }
}

function simple_moving_averager(dataStream) {
    var smaStream = [];
    var span = rawData[3];  //Span is in min
    var buffer = rawData[4]; //Buffer is in min
    var x;
    for (item in dataStream) {
        item = Number(item);
        if (item < buffer / span) {
            x = 0;
            for (var j = 0; j < (item + 1); j++) {
                x += dataStream[item - j];
            }
            smaStream[item] = (x / (item + 1));
        } else {
            x = 0;
            for (var j = 0; j < buffer / span + 1; j++) {
                x += dataStream[item - j];
            }
            smaStream[item] = (x / (buffer / span + 1));
        }
    }
    return smaStream;
}

function graph() {
    //Formatting the data based on the span/buffer etc
    //Clear all the old data
    var formattedData = [];
    var sum = [];
    for (collumn in rawData[1]) {
        sum.push(0);
    }
    for (line in rawData[2]) {
        //First collumn must be timeStamp
        //If the timestamp, divides evenly in span
        if (line % rawData[3] == 0 && line != 0) {
            //Push in a empty array for each line
            formattedData.push([]);
            //Take the start time, and for each line add span worth of min.
            formattedData[formattedData.length - 1].push(new Date(rawData[0].getTime() + ((formattedData.length - 1) * rawData[3] * 60000)));
            //Add in the actual lines of data
            for (collumn in rawData[1]) {
                formattedData[formattedData.length - 1].push(sum[collumn]);
                //And extra collum in pushed for future moving average data
                formattedData[formattedData.length - 1].push(0);
                sum[collumn] = 0;
            }
        }
        for (input in rawData[2][line]) {
            sum[input] += rawData[2][line][input];
        }
    }
    //Now calulate the moving average
    var smaArray = [];
    //Prepare the sma array with empty arrays
    for (collumn in rawData[1]) {
        smaArray.push([]);
    }
    for (line in formattedData) {
        //Each array must contain all the data for that line, the evens have the summed data
        for (collumn in rawData[1]) {
            smaArray[collumn].push(formattedData[line][(collumn * 2) + 1]);
        }
    }
    //Convert the raw data to sma data
    for (collumn in smaArray) {
        smaArray[collumn] = simple_moving_averager(smaArray[collumn]);
    }
    //And then insert that data into the fomratted data
    for (line in formattedData) {
        for (collumn in rawData[1]) {
            formattedData[line][(collumn * 2) + 2] = smaArray[collumn][line];
        }
    }

    // console.log(rawData);
    // console.log(formattedData);    
    setupChart(formattedData);
    drawChart();
}

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(readFile);

function setupChart(formattedData) {
    chartData = new google.visualization.DataTable();
    //You must have a date column to start
    chartData.addColumn('date', 'Time');
    //Add in all the other columns from the columnHeader
    for (input in rawData[1]) {
        chartData.addColumn('number', rawData[1][input] + " Raw");
        chartData.addColumn('number', rawData[1][input] + " Moving AVG");
    }
    //Grab the formatted data, and graph it
    chartData.addRows(formattedData);

    chartOptions = {
        title: chartTitle,
        titleTextStyle: {
            color: '#839496',
            fontName: '"Avant Garde",Avantgarde,"Century Gothic",CenturyGothic,AppleGothic,sans-serif',
            fontSize: '30',
            bold: false
        },
        vAxis: {
            title: 'Counts',
            titleTextStyle: {
                fontSize: 16,
                color: '#93a1a1'
            },
            gridlines: {
                color: '073642'
            },
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 'auto',
                min: 'auto'
            },
            textStyle: {
                color: '#93a1a1'
            }
        },
        hAxis: {
            title: 'Time (UTC)',
            titleTextStyle: {
                fontSize: 16,
                color: '#93a1a1'
            },
            gridlines: {
                color: '073642'
            },
            textStyle: {
                color: '#93a1a1'
            }
        },
        explorer: {
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomOut: 1
        },
        backgroundColor: 'transparent',
        legend: {
            textStyle: {
                color: '#93a1a1'
            }
        }
    };
    //Style the points and lines
    chartOptions.series = {};
    for (input in rawData[1]) {
        //First the point
        chartOptions.series[input * 2] = {};
        chartOptions.series[input * 2].pointSize = 3;
        // Then the line
        chartOptions.series[(input * 2) + 1] = {};
        chartOptions.series[(input * 2) + 1].lineWidth = 3;
        chartOptions.series[(input * 2) + 1].pointsVisible = 0;
    }

    drawChart();
}

function drawChart() {
    var chart = new google.visualization.ScatterChart(document.getElementById('linechart_material'));
    chart.draw(chartData, chartOptions);
}

//On loading the webpage, various housekeeping
window.onload = function () {
    //Add Icons
    document.getElementById("iconRow").appendChild(createButton("fa-file-text-o", dataFile));
    document.getElementById("iconRow").appendChild(createButton("fa-github", "https://github.com/ahruschka/detectorWebInterface"));

    //Adding an icon button
    function createButton(icon, link) {
        var a = document.createElement("a");
        var li = document.createElement("li");

        a.className += (" icon");
        a.className += (" ");
        a.className += (icon);
        a.setAttribute("href", link);

        li.appendChild(a);

        return li;
    }
};

//Every time the browser gets resized, draw the chart;
window.onresize = function () {
    drawChart();
};