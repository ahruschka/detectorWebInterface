var dataSet;
var dataName;
var timeStamp;
var startDate;
var dataArray;
var spanArray = new Array;
var span = document.getElementById("span").value;
document.getElementById("spanValue").innerHTML=span;
var buffer = document.getElementById("buffer").value;
document.getElementById("bufferValue").innerHTML=buffer;
var sma = simple_moving_averager(buffer*60/span);
var smaArray = new Array;

function simple_moving_averager(period){
  smaArray = [];
  var x;
  for (var i = 0; i < spanArray.length-1;i++){
    if(i<buffer){
      x = 0;
      for(var j = 0;j<i;j++){
        x = x + spanArray[i-j];
      }
      smaArray[i] = (x/i);
    }else{
      x = 0;
      for(var j = 0;j<buffer;j++){
        x = x + spanArray[i-j];
      }
      smaArray[i] = (x/buffer);
    }
  }
}
function read(textFile){
  var xhr=new XMLHttpRequest;
  xhr.open('GET',textFile);
  xhr.onload=show;
  xhr.send();
}
function spanBufferChanged(){
  buffer = document.getElementById("buffer").value;
  document.getElementById("bufferValue").innerHTML=buffer;
  span = document.getElementById("span").value;
  document.getElementById("spanValue").innerHTML=span;
  formatData(span);
  sma = simple_moving_averager(buffer*60/span);
  drawChart();
}
function show(){
  //var pre=document.createElement('pre');
  dataSet=this.response.split("\r\n");
  dataName = dataSet.shift().split("\n");
  var dateArray= dataName[0].split("_");
  timeStamp = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  startDate = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  //Removes counts before first hour
  if((59-startDate.getMinutes()) != 0){
    var extras = 59-startDate.getMinutes();
    for (var i = 0; i < extras; i++) {
      timeStamp.setTime(timeStamp.getTime()+60000);
    }
  }
  formatData(span);
  sma = simple_moving_averager(buffer*60/span);

  //pre.textContent=this.response.split("\r\n");
  // document.body.appendChild(pre)
}
function formatData(x) {
  //Andrew Test
  spanArray = [];
  var total = 0;
  var i;
  var c = 0;
  for(i=0;i<(dataSet.length)-1;i++){
    if(c==x){
      spanArray.push(total/x);
      total = 0;
      c = 0;
    }else{
      total = total + Number(dataSet[i]);
      c++;
    }
  }
}


read("http://"+location.hostname+"/2016_07_18__14_45_30.log");
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  var timeAdvance = new Date();
  timeAdvance.setTime(timeStamp.getTime());
  data.addColumn('date', 'Time');
  data.addColumn('number', 'Counts');
  data.addColumn('number','Rolling Average')

  for (i = 0; i < spanArray.length-1; i++) {
    timeAdvance.setTime(timeAdvance.getTime()+(span*60000));
    data.addRow([
      new Date(timeAdvance.getTime()),
      spanArray[i],
      smaArray[i]
    ]);
  }

  var options = {
    // chart:{
    //   title: 'Double Paddle Detector',
    //   subtitle: 'Start Time: ' + startDate.toString(),
    // },
    title: 'Double Paddle Detector',
    titleTextStyle:{
      color: '#839496',
      fontName: '"Avant Garde",Avantgarde,"Century Gothic",CenturyGothic,AppleGothic,sans-serif',
      fontSize: '30',
      bold: false
    },
    vAxis: {
      gridlines: {
        color: '073642'
      },
      viewWindowMode:'explicit',
      viewWindow:{
        max: 'auto',
        min: 'auto'
      },
      textStyle:{
        color: '#93a1a1'
      }
    },
    hAxis: {
      gridlines: {
        color: '073642'
      },
      textStyle:{
        color: '#93a1a1'
      }
    },
    explorer: {
      axis: 'horizontal',
      keepInBounds: true,
      maxZoomOut: 1
    },
    series: {
      0: {
        axis: 'Counts',
        color: '#eee8d5',
        pointSize: 3
      },
      1: {
        axis: 'Rolling Average',
        lineWidth: 3,
        color: '#6c71c4',
        // pointSize: 1,
        pointsVisible: 0
      }
    },
    backgroundColor: 'transparent',
    // height:400,
    legend: {
      position: 'none'
    }
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('linechart_material'));

  chart.draw(data, options);
}

window.onresize=function(){
  drawChart();
}
