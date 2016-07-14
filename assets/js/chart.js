var dataSet;
var dataName;
var date;
var startDate;
var dataArray;

function read(textFile){
  var xhr=new XMLHttpRequest;
  xhr.open('GET',textFile);
  xhr.onload=show;
  xhr.send()
}

function show(){
  //var pre=document.createElement('pre');
  dataSet=this.response.split("\r\n");
  dataName = dataSet.shift().split("\n");
  var dateArray= dataName[0].split("_");
  date = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  startDate = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  //pre.textContent=this.response.split("\r\n");
  document.body.appendChild(pre)
}

// read("http://"+location.hostname+"2016_07_12__14_28_28.log");
read("http://131.96.182.121/2016_07_12__14_28_28.log");
google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Time');
  data.addColumn('number', 'CPM');

  for (i = 0; i < dataSet.length-1; i++) {
    date.setTime(date.getTime()+60000);
    if(i<5){
    }
    data.addRow([date.toString(), Number(dataSet[i])]);
  }

  var options = {
    chart:{
      title: 'Double Paddle Detector',
      subtitle: 'Start Time: ' + startDate.toString(),
    },
    vAxis: {
      viewWindowMode:'explicit',
      viewWindow:{
        max: 'auto',
        min:0
      }
    },
    explorer: {
    },
    backgroundColor: 'transparent',
    //height:400,
    legend: {
      position: 'none'
    }
  };

  var chart = new google.charts.Line(document.getElementById('linechart_material'));

  chart.draw(data, google.charts.Line.convertOptions(options));
}

window.onresize=function(){
  drawChart();
}
