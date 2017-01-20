#!/bin/bash
set -e

if [ "$#" -ne 5 ] ; then
	echo "Usage: $0 <port> </url_suffix> <path to settings file> <service_name> <mongo port>"
	echo ""
	echo "Examples:"
	echo "  $0 myserver.ics.hawaii.edu 5001 / ../config/settings.json meteor_myapp"
	echo "  $0 myserver.ics.hawaii.edu 5001 /my_app ../config/settings.json meteor_myapp"
	exit 1
fi

PORT=$1
URL_SUFFIX=$2
SETTINGS_FILE=$3
SERVICE_NAME=$4
MONGO_PORT=$5

if [ ! -e $SETTINGS_FILE ]; then
	echo "Can't find file '$SETTINGS_FILE'"
	exit 1
fi

if [ ! -r $SETTINGS_FILE ]; then
	echo "File '$SETTINGS_FILE' is not readable"
	exit 1
fi

SETTINGS_FILE="$(cd "$(dirname $SETTINGS_FILE)"; pwd)/$(basename $SETTINGS_FILE)"

MAIN_DIR=`cd ..; pwd`



cat ./init.d_script.in \
	| sed "s|@SERVICE_NAME@|$SERVICE_NAME|"  \
	| sed "s|@PORT@|$PORT|"  \
	| sed "s|@URL_SUFFIX@|$URL_SUFFIX|"  \
	| sed "s|@SETTINGS_FILE@|$SETTINGS_FILE|"  \
	| sed "s|@MAIN_DIR@|$MAIN_DIR|"  \
	| sed "s|@MONGO_PORT@|$MONGO_PORT|"  \
     	> ./$SERVICE_NAME

#echo "Script generated in ./$SERVICE_NAME"
