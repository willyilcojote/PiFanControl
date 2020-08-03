# PiFanControl
A simple fan control program for Raspberry Pi

## How it works
It keep under control the CPU temperature by reading `/sys/class/thermal/thermal_zone0/temp` and when it reaches 60 degrees celcius it power on the fan. Then when the temperature is decresed at least of three degrees celsius and the fan is powered on for at least of 2 minutes it can be switched off.
The fan can be switched off also if the CPU temperature is less than 50 degrees celsius and the fan is powered on for at least of 5 minutes.

## Requirements
- You need a little circuit board (soon the schematic) that with 2 little transistor (2N2222A) and a bunch of resistors keep always the fan on unless the program set a GPIO pin high. In this case the power line is cutted and the fan stop spinning.

- `nodejs` installed (See https://github.com/nodesource/distributions/blob/master/README.md for more info on how to install)

- 5V Fan for Raspberry Pi

## How to install

- `git clone https://github.com/willyilcojote/PiFanControl.git/`
- `cd PiFanControl && npm install && cd ..`
- `sudo cp PiFanControl /opt/`
- `cd /opt/PiFanControl`
- `sudo chmod +x app.js`
- `sudo cp PiFanControl.service /etc/systemd/system/`
- `sudo systemctl enable PiFanControl.service`
- `sudo reboot`

Soon I upload an installer script for an automated process.

## How to configure

In the third line of `app.js` you have to change the number 18 with the GPIO pin number you are using to drive your fan. Please refer to https://www.raspberrypi.org/documentation/usage/gpio/ for more information about GPIO connections.

## How to manage PiFanControl service

To manage the autorun on boot I use systemd units, so to manage it you have to:

- `sudo systemctl enable|disable PiFanControl.service` to enable/disable the service on boot.
- `sudo systemctl start|stop|restart PiFanControl.service` to manully start|stop|restart the service.

## Details about the board
You can create you board using a simple peace of prototype PCB, two 2N2222A PNP transistor, three 3K3 resistor, some pin headers and some cables. If you want to use some professional board you can order some printed PCB form an online PCB printer service.

I used 2N2222A transistor because they are cheap and easy to find, but they are PNP transistor so to be activated they require an high signal at the base so I inverted the signal on the main transistor (connected to the fan) with a push-up resistor and the second transistor (controlled by the Pi). When the Pi activate the second transistor it push the base of the main transistor to ground so it switch off and the fan stop spinning.

The fan keep speenning also when the Pi is switched off and the power is connected. (A possible solution is to use the 3.3V source on the board that provide power only when the Pi is actually on)

## Hints
If your Pi has heavy jobs to perform you shoudn't use this controller but instead you should connent a fan directly between 5V and GND for maximum performance.

Using a different type of transistor you can connect even bigger fans or 12V fans for even better performance.