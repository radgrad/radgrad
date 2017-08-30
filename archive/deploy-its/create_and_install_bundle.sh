#!/bin/bash
set -e

# Create the bundle
echo "Building the Meteor bundle..."
cd ../app && meteor build --directory ..

# NMP install
echo "NPM-install of the bundle..."
cd ../bundle/programs/server && npm install

