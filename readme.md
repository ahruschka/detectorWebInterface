MPPC Control Web Interface
==========================
The *app* is written in mostly javascript, and hopefully will use a deployment engine at some point. Currently installation is done with a bash script.

## Install
Installation guide for a raspberry pi, these commands require sudo. the setup.sh script will do the same.

### Download
If git is not installed.
```bash
apt-get -y update
apt-get -y install git
```
Then just clone this repository.
```bash
git clone https://github.com/Sawaiz/mppcControl
```
*config.json* needs to be edited to match your configuration. every time the server starts, it looks in here to decide what GPIO are available.

### Packages
Update cache for apt-get so we can install the nodejs that works for raspberry pi 2 (arm v7).

```bash
curl -sLS https://apt.adafruit.com/add | sudo bash
```

Then, after a general update, we install nginx (webserver), node (nodejs server side javascript), and npm (node package manager).

```bash
apt-get -y update
apt-get -y upgrade
apt-get -y install nginx
apt-get -y install node
apt-get -y install npm
```
### NGINX setup
Change directory into the repository
```bash
cd mppcControl
```
Copy the NGINX config file to the install location, and remove the default www folder location.
```bash
cp ./mppcControl /etc/nginx/sites-available/mppcControl
ln -s /etc/nginx/sites-available/mppcControl /etc/nginx/sites-enabled/mppcControl
rm /etc/nginx/sites-available/default
```
Make the new *mppcControl* directory.
```bash
mkdir /var/www/mppcControl/
```
### Copy Files
If you are updating, or installing after changes were made, clear the directory, save the node packages.
```bash
cd /var/www/mppcControl
shopt -s extglob
rm -rf !(node_modules)
```

Then just copy the files over, and change mode.

```bash
cp -R ./* /var/www/mppcControl
chmod -R 755 /var/www/mppcControl/*
```

Change to the mppcControl directory, and install node dependencies. This looks in the package.json files and installs the required packages.
```bash
cd /var/www/mppcControl
npm install
```

### Start server files
In order for the server to start on boot, it needs to be added to the '/etc/rc.local' file. Use your favorite text editor

```bash
nano /etc/rc.local
```

Add the following line before "exit 0"

```
/var/www/mppcControl/node_modules/forever/bin/forever start /var/www/mppcControl/server.js
```
Then we restart nginx, and start our server script.

```bash
service nginx restart
/var/www/mppcControl/node_modules/forever/bin/forever start /var/www/mppcControl/server.js
```

## Using the webpage

The configuration is stored in (config file doesn't exist yet, gpio's are hardcoded in assets/js/gpio.js) sets the gpio and name shown on the webpage as well as the associated image.
# detectorWebInterface
