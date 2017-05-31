import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { RadGrad } from '../../api/radgrad/radgrad';
import { getRestoreFileAge, loadCollection } from '../../api/test/test-utilities';

/* global Assets */

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
  return _.reduce(documentCounts(), function (sum, count) {
    return sum + count;
  }, 0);
}

/**
 * If the database is empty, this function looks up the name of the load file in the settings file,
 * then reads it in and calls define() on its contents in order to rebuild the RadGrad database.
 * Console messages are generated when the contents of the load file does not include collections that
 * this function assumes are present. Conversely, if the load file contains collections not processed with
 * this file, a string is also printed out.
 */
function initializeDB() { // eslint-disable-line
  Meteor.startup(() => {
    if (totalDocuments() === 0) {
      const loadFileName = Meteor.settings.public.databaseRestoreFileName;
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
    }
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
  });
}

// Now initialize the DB if it's currently empty.
initializeDB();
