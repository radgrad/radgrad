#!/bin/bash
set -e

if [ "$#" -ne 2 ] ; then
	echo "Usage: $0 <service name> <port>"
	exit 1
fi

SERVICE_NAME=$1
PORT=$2

ORIGINAL_CONFIG_FILE=/etc/mongod.conf
CONFIG_FILE=/etc/mongo_$SERVICE_NAME.conf

#echo "  Creating $CONFIG_FILE..."
cat $ORIGINAL_CONFIG_FILE | \
	sed "s|/var/log/mongodb/mongod.log|/var/log/mongodb/mongod_$SERVICE_NAME.log|" | \
	sed "s|dbPath: /var/lib/mongo|dbPath: /var/lib/mongo_$SERVICE_NAME|" | \
	sed "s|pidFilePath: /var/run/mongodb/mongod.pid|pidFilePath: /var/run/mongodb/mongod_$SERVICE_NAME.pid|" | \
	sed "s|port:.*|port: $PORT|" \
	> /tmp/mongod.conf
sudo mv -f /tmp/mongod.conf $CONFIG_FILE

#echo "  Creating /var/lib/mongo_$SERVICE_NAME directory..."
sudo mkdir -p /var/lib/mongo_$SERVICE_NAME
sudo chown mongod:mongod /var/lib/mongo_$SERVICE_NAME

ORIGINAL_INITD_FILE=/etc/init.d/mongod 
INITD_FILE=/etc/init.d/mongod_$SERVICE_NAME

cat $ORIGINAL_INITD_FILE | \
	sed "s|config: /etc/mongod.conf|config: $CONFIG_FILE|" | \
	sed "s|CONFIGFILE=\"/etc/mongod.conf\"|CONFIGFILE=\"$CONFIG_FILE\"|" | \
	sed "s|Starting mongod|Starting mongod_$SERVICE_NAME|" | \
	sed "s|Error starting mongod|Error starting mongod_$SERVICE_NAME|" | \
	sed "s|Stopping mongod|Stopping mongod_$SERVICE_NAME|" \
	> /tmp/mongod
sudo mv -f /tmp/mongod $INITD_FILE
sudo chmod +x $INITD_FILE
