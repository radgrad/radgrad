import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { RadGrad } from '../../api/radgrad/radgrad';
import { getRestoreFileAge, restoreCollection } from '../../api/test/fixture-utilities';

/* global Assets */

/** @module startup/server/fixtures */

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
 * If the database is empty, this function looks up the name of the restore file in the settings file,
 * then reads it in and calls define() on its contents in order to rebuild the RadGrad database.
 * Console messages are generated when the contents of the restore file does not include collections that
 * this function assumes are present. Conversely, if the restore file contains collections not processed with
 * this file, a string is also printed out.
 */
function initializeDB() { // eslint-disable-line
  Meteor.startup(() => {
    if (totalDocuments() === 0) {
      const restoreFileName = Meteor.settings.public.databaseRestoreFileName;
      const restoreFileAge = getRestoreFileAge(restoreFileName);
      console.log(`Restoring database from file ${restoreFileName}, dumped ${restoreFileAge}.`);
      const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
      // The list of collections, ordered so that they can be sequentially restored.
      const collectionList = RadGrad.collectionLoadSequence;

      const restoreNames = _.map(restoreJSON.collections, obj => obj.name);
      const collectionNames = _.map(collectionList, collection => collection._collectionName);
      const extraRestoreNames = _.difference(restoreNames, collectionNames);
      const extraCollectionNames = _.difference(collectionNames, restoreNames);

      if (extraRestoreNames.length) {
        console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
      }
      if (extraCollectionNames.length) {
        console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
      }

      if (!extraRestoreNames.length && !extraCollectionNames.length) {
        _.each(collectionList, collection => restoreCollection(collection, restoreJSON, true));
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
