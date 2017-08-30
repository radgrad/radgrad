#!/bin/bash
set -e

if [ "$#" -ne 4 ] ; then
	echo "Usage: $0 <server name> <port> </url_suffix> <path to settings file>"
	echo ""
	echo "Examples:"
	echo "  $0 myserver.ics.hawaii.edu 5001 / ../config/settings.json"
	echo "  $0 myserver.ics.hawaii.edu 5001 /my_app ../config/settings.json"
	exit 1
fi

SERVER_NAME=$1
PORT=$2
URL_SUFFIX=$3
SETTINGS_FILE=$4

if [ ! -e $SETTING_FILE ]; then
	echo "Can't find file '$SETTINGS_FILE'"
	exit 1
fi

if [ ! -r $SETTING_FILE ]; then
	echo "File '$SETTINGS_FILE' is not readable"
	exit 1
fi

cd ../app && ROOT_URL=http://$SERVER_NAME:$PORT$URL_SUFFIX meteor --settings=$SETTINGS_FILE  --port $PORT --no-release-check


