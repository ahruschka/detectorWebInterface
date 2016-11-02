const fs = require('fs'); //Accsess the filesystem
var config = require('./config');
var GPIO = require('onoff').Gpio; // Constructor function for Gpio objects.

var led = new GPIO(14, 'out');    // Export GPIO #14 as an output.
var pins = config.pins;

//create a file, named by the start time
var fileName = new Date().toISOString();
var header = "date,";
for (pin in pins) {
    header += pins[pin][0];
    if (pin < pins.length - 1) {
        header += ",";
    }
}
header += "\n";

fs.writeFile(fileName + ".log", header, function (err) {
    if (err) throw err;
    console.log("Logging started in " + fileName);
});

setInterval(function () {
    var logLine = new Date().toISOString() + ",";
    for (pin in pins) {
        logLine += pins[pin][2].count.toString();
        pins[pin][2].count = 0;
        if (pin < pins.length - 1) {
            logLine += ",";
        } else {
            logLine += "\n";
        }
    }
    fs.appendFile(fileName + ".log", logLine, function (err) {
    });
}, 5000);

for (pin in pins) {
    pins[pin].push(new coincidence(pins[pin][1]));
    pins[pin][2].number.watch(function (err, value) {
        pins[pin][2].count++;
    });
}


// pins[0][2].number.watch(function (err, value) {
//     pins[0][2].count++;
// });
// pins[1][2].number.watch(function (err, value) {
//     pins[1][2].count++;
// });
// pins[2][2].number.watch(function (err, value) {
//     pins[2][2].count++;
// });
// pins[3][2].number.watch(function (err, value) {
//     pins[3][2].count++;
// });
// pins[4][2].number.watch(function (err, value) {
//     pins[4][2].count++;
// });
// pins[5][2].number.watch(function (err, value) {
//     pins[5][2].count++;
// });

function coincidence(number) {
    this.number = new GPIO(number, 'in', 'falling');
    this.count = 0;
}
