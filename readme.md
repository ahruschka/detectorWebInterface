Detector Web Interface
==========================
## Install
Installation guide for a raspberry pi, these commands require sudo.

### Download
If git is not installed.
```bash
apt-get -y update
apt-get -y install git
```
Then just clone this repository.
```bash
git clone https://github.com/ahruschka/detectorWebInterface
```

### Copy Files
If you are updating, or installing after changes were made, clear the directory, save the node packages.
```bash
cd /var/www/detectorWebInterface
shopt -s extglob
rm -rf !(node_modules)
```

Then just copy the files over, and change mode.

```bash
cp -R ./* /var/www/detectorWebInterface
chmod -R 755 /var/www/detectorWebInterface/*
```
## Resources
[Setting up a Wifi Dongle on the raspberryPi](https://gist.github.com/ahruschka/4ae8e51a4af98182195cd9286a39a1c6)

[Fixing the date on GSU NTP servers](https://gist.github.com/ahruschka/4d7949a97257172971481bec3c902bca)
