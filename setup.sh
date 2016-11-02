#!/bin/bash
#Check if running as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

read -e -p "Change hostname to: " host
read -e -s -p "Change Root (pi) Password to: " rootPasswd
echo ""
read -e -p "Add User, Username: " userName
read -e -s -p "$userName Password: " userPasswd
echo ""

#Change root (pi) password
echo "pi:$rootPasswd" | chpasswd

#Assign existing hostname to $hostn
hostn=$(cat /etc/hostname)

#change hostname in /etc/hosts & /etc/hostname
sudo sed -i "s/$hostn/$host/g" /etc/hosts
sudo sed -i "s/$hostn/$host/g" /etc/hostname

#Create the user
useradd -m -G sudo $userName
echo "$userName:$userPasswd" | chpasswd

#Update/upgrade
apt-get update && apt-get -y upgrade

#Install Docker
curl -sSL https://get.docker.com | sh
#Add users to docker group, prhaps not needed as GPIO needs root
usermod -aG docker pi
usermod -aG docker $userName

#Install Docker Compose
apt-get -y install python-pip
pip install docker-compose

#Done, ask for a reboot