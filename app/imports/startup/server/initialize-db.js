import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { loadCollection } from '../../api/test/test-utilities';
import { removeAllEntities } from '../../api/base/BaseUtilities';
import { checkIntegrity } from '../../api/integrity/IntegrityChecker';
import { ROLE } from '../role/Role';

/* global Assets */
/* eslint no-console: "off" */

/** @module startup/server/initialize-db */

/**
 * Returns an Array of numbers, one per loadable collection, indicating the number of documents in that collection.
 * @returns { Array } An array of collection document counts.
 */
function documentCounts() {
  return _.map(RadGrad.collectionLoadSequence, collection => collection.count());
}

/**
 * Returns the total number of documents in the loadable collections.
 * @returns { Number } The total number of RadGrad documents in the loadable collections.
 */
function totalDocuments() {
  return _.reduce(documentCounts(), function reducer(sum, count) {
    return sum + count;
  }, 0);
}

/**
 * The load/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 */
const loadFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the load file was created. Parses the file name string.
 * @param loadFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 */
function getRestoreFileAge(loadFileName) {
  const terms = _.words(loadFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, loadFileDateFormat).fromNow();
}

/**
 * If the database is empty, this function looks up the name of the load file in the settings file,
 * and if it is specified, then it reads it in and calls define() on its contents in order to load the database.
 * Console messages are generated when the contents of the load file does not include collections that
 * this function assumes are present. Conversely, if the load file contains collections not processed with
 * this file, a string is also printed out.
 */
function loadDatabase() {
  const loadFileName = Meteor.settings.public.databaseRestoreFileName;
  if (loadFileName && (totalDocuments() === 0)) {
    const loadFileAge = getRestoreFileAge(loadFileName);
    console.log(`Loading database from file ${loadFileName}, dumped ${loadFileAge}.`);
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    // The list of collections, ordered so that they can be sequentially restored.
    const collectionList = RadGrad.collectionLoadSequence;

    const loadNames = _.map(loadJSON.collections, obj => obj.name);
    const collectionNames = _.map(collectionList, collection => collection._collectionName);
    const extraRestoreNames = _.difference(loadNames, collectionNames);
    const extraCollectionNames = _.difference(collectionNames, loadNames);

    if (extraRestoreNames.length) {
      console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
    }
    if (extraCollectionNames.length) {
      console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
    }

    if (!extraRestoreNames.length && !extraCollectionNames.length) {
      _.each(collectionList, collection => loadCollection(collection, loadJSON, true));
    }
    console.log('Finished loading database.');
  }
}

/**
 * Runs the PublicStats generator to collect stats on the database, then sets up a cron job to update the stats
 * once a day.
 */
function startupPublicStats() {
  PublicStats.generateStats();
  SyncedCron.add({
    name: 'Run the PublicStats.generateStats method',
    schedule(parser) {
      return parser.text('every 24 hours');
    },
    job() {
      PublicStats.generateStats();
    },
  });
  SyncedCron.start();
}

/**
 * Check the integrity of the newly loaded collections; print out problems if any occur.
 */
function startupCheckIntegrity() {
  console.log('Checking DB integrity.');
  const integrity = checkIntegrity();
  if (integrity.count > 0) {
    console.log(checkIntegrity().message);
  }
}

function generateAdminCredential() {
  if (Meteor.settings.admin.development) {
    return 'foo';
  }
  // adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  let credential = '';
  const maxPasswordLength = 30;
  const minPasswordLength = 6;
  const passwordLength = Math.floor(Math.random() * (maxPasswordLength - (minPasswordLength + 1))) + minPasswordLength;
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < passwordLength; i++) { // eslint-disable-line no-plusplus
    credential += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return credential;
}

function defineAdminUser() {
  const adminUsername = Meteor.settings && Meteor.settings.admin && Meteor.settings.admin.username;
  if (!adminUsername) {
    console.log('\n\nNO ADMIN USERNAME SPECIFIED IN SETTINGS FILE! SHUTDOWN AND FIX!!\n\n');
    return;
  }
  const credential = generateAdminCredential();
  const userID = Accounts.createUser({ username: adminUsername, email: adminUsername, password: credential });
  Roles.addUsersToRoles(userID, ROLE.ADMIN);
  console.log(`Defined admin user: ${adminUsername}`);
  console.log(`Credential: "${credential}"`);
}

// Add a startup callback that distinguishes between test and dev/prod mode and does the right thing.
Meteor.startup(() => {
  if (Meteor.isTest || Meteor.isAppTest) {
    console.log('Test mode. Database initialization disabled and current database cleared.');
    removeAllEntities();
  } else {
    defineAdminUser();
    loadDatabase();
    startupCheckIntegrity();
    startupPublicStats();
  }
});
