Detector Web Interface
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

# detectorWebInterface
