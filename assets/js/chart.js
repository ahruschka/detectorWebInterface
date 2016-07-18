var dataSet;
var dataName;
var timeStamp;
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
  timeStamp = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  startDate = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[4],dateArray[5],dateArray[6]);
  //pre.textContent=this.response.split("\r\n");
  // document.body.appendChild(pre)
}
function simple_moving_averager(period) {
    var nums = [];
    return function(num) {
        nums.push(num);
        if (nums.length > period)
            nums.splice(0,1);  // remove the first element of the array
        var sum = 0;
        for (var i in nums)
            sum += nums[i];
        var n = period;
        if (nums.length < period)
            n = nums.length;
        return(sum/n);
    }
}

var sma = simple_moving_averager(60);
// for (var i in data) {
//   var n = data[i];
//   console.log("Next number = " + n + ", SMA_3 = " + sma3(n) + ", SMA_5 = " + sma5(n));
// }

read("http://"+location.hostname+"/2016_07_14__12_43_25.log");
google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Time');
  data.addColumn('number', 'RollingAVG');

  for (i = 0; i < dataSet.length-1; i++) {
    timeStamp.setTime(timeStamp.getTime()+60000);
    data.addRow([
      new Date(timeStamp.getTime()),
      sma(Number(dataSet[i]))
    ]);
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
        min: 'auto'
      }
    },
    explorer: {
    },
    backgroundColor: 'transparent',
    // height:400,
    // legend: {
    //   position: 'none'
    // }
  };

  var chart = new google.charts.Line(document.getElementById('linechart_material'));

  chart.draw(data, google.charts.Line.convertOptions(options));
}

window.onresize=function(){
  drawChart();
}
