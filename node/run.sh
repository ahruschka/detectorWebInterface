#!/bin/bash
#Check if running as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi
# Script that reads in console.log from node.js, and outputs it to a file with the current timestamp.
today=`TZ=":UTC" date '+%Y_%m_%d__%H_%M_%S'`;
echo $today > $today.log
node server.js >> $today.log
#Symlink it to twoPaddleData.log
ln -s $today.log /var/www/detectorWebInterface/twoPaddleData.log
