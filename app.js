#!/usr/bin/node
var Gpio = require('onoff').Gpio;
var FAN = new Gpio(18, 'out');
var fs = require('fs');

let lastTemp = Math.round(Number(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp'))/1000);
let lastTime = Date.now();

var checkTemperature = () => {
    fs.readFile('/sys/class/thermal/thermal_zone0/temp', (err, data) => {
        if (err) {
            console.log('Unable to read themperature, fan powerd on for security reason');
            FAN.writeSync(1);
        } else {
            let temp = Math.round(Number(data)/1000);
            let time = Date.now();
            console.log(`Current temperature: ${temp}`);
            if (temp - lastTemp >= 3 && temp >= 60) {
                console.log(`Fan on`)
                FAN.writeSync(1);
                lastTime = time;
                lastTemp = temp;
            } else if (temp - lastTemp <= -3 && time - lastTime >= 120000) {
                console.log(`Fan off`);
                FAN.writeSync(0);
                lastTime = time;
                lastTemp = temp;
            } else {
                if (temp < 50 && time - lastTime >= 300000) {
                    console.log(`Fan off`);
                    lastTemp = temp;
                    lastTime = time;
                    FAN.writeSync(0);
                }
            }
        }
    });
}

setInterval(checkTemperature, 10000);

process.on('exit', () => {
    FAN.writeSync(0);
    FAN.unexport();
});