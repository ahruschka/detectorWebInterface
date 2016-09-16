#Made for deploying application
appName=detectorWebInterface

all: | setup deploy

deploy:$(appName)
	cp ./$(appName) /etc/nginx/sites-available/$<
	ln -sf /etc/nginx/sites-available/$< /etc/nginx/sites-enabled/$<
	rm -f /etc/nginx/sites-enabled/default
	mkdir -p /var/www/$</
	cd /var/www/$< &&\
	find . -maxdepth 1 ! -name 'node_modules' ! -name '.' ! -name '..' -exec rm -rf {} +
	cp -R ./* /var/www/$<
	cd /var/www/$< &&\
	npm install
	chmod -R 755 /var/www/$</*
	service nginx restart    

$(appName):nginxTemplate
	sed -e 's/nginxTemplate/$@/g' $< > $@

setup:
	#Install webserver, node, node package manager
	apt-get -y update
	apt-get -y upgrade
	apt-get -y install nginx
	cd /tmp
	wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv7l.tar.xz
	tar -xf node-v4.4.7-linux-armv7l.tar.xz
	cd node-v4.4.7-linux-armv7l
	cp -R * /usr/local/
	apt-get -y install npm

cleanAll: clean
	rm -rf /var/www/$(appName)

clean:
	rm $(appName)
	find . -maxdepth 1 ! -name 'node_modules' ! -name '.' ! -name '..' -exec rm -rf {} +