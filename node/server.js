var GPIO = require('onoff').Gpio; // Constructor function for Gpio objects.
var led = new GPIO(14, 'out');    // Export GPIO #14 as an output.
//its an array of arrays
var pins = [
    ['One and Two   :', 22],
    ['One and Three :', 27],
    ['One and Four  :', 17],
    ['Two and Three :', 06],
    ['Two and Four  :', 26],
    ['Three and Four:', 05],
];

console.log('1&2,1&3,1&4,2&3,2&4,3&4');

setInterval(function () {
    console.log(
        pins[0][2].count + ',' +
        pins[1][2].count + ',' +
        pins[2][2].count + ',' +
        pins[3][2].count + ',' +
        pins[4][2].count + ',' +
        pins[5][2].count
    );
    for(pin in pins){
        pin[2].count=0;
    }
    // pins[0][2].count = 0;
    // pins[1][2].count = 0;
    // pins[2][2].count = 0;
    // pins[3][2].count = 0;
    // pins[4][2].count = 0;
    // pins[5][2].count = 0;
    //console.log(" ");
}, 60000);

for (i = 0; i < pins.length; i++) {
    pins[i].push(new coincidence(pins[i][1]));
}

pins[0][2].number.watch(function (err, value) {
    pins[0][2].count++;
});
pins[1][2].number.watch(function (err, value) {
    pins[1][2].count++;
});
pins[2][2].number.watch(function (err, value) {
    pins[2][2].count++;
});
pins[3][2].number.watch(function (err, value) {
    pins[3][2].count++;
});
pins[4][2].number.watch(function (err, value) {
    pins[4][2].count++;
});
pins[5][2].number.watch(function (err, value) {
    pins[5][2].count++;
});

function coincidence(number) {
    this.number = new GPIO(number, 'in', 'falling');
    this.count = 0;
}
