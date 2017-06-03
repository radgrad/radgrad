import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { RadGrad } from '../radgrad/RadGrad';

/* global Assets */

/** @module api/test/test-utilities */

/**
 * Returns the definition array associated with collectionName in the loadJSON structure,
 * or an empty array if none was found.
 * @param loadJSON The load file contents.
 * @param collection The collection of interest.
 */
function getDefinitions(loadJSON, collection) {
  const definitionObj = _.find(loadJSON.collections, obj => obj.name === collection);
  return definitionObj ? definitionObj.contents : [];
}

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 */
export function loadCollection(collection, loadJSON, consolep) {
  const definitions = getDefinitions(loadJSON, collection._collectionName);
  if (consolep) {
    console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`); // eslint-disable-line
  }
  _.each(definitions, definition => collection.define(definition));
}

/**
 * The load/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 */
export const loadFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the load file was created. Parses the file name string.
 * @param loadFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 */
export function getRestoreFileAge(loadFileName) {
  const terms = _.words(loadFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, loadFileDateFormat).fromNow();
}

/**
 * Loads data from a test fixture file.
 * @param fixtureName The name of the test fixture data file. (located in private/database/testing).
 */
export function defineTestFixture(fixtureName) {
  if (Meteor.isServer) {
    const loadFileName = `database/testing/${fixtureName}`;
    console.log(`    (Restoring test fixture from file ${loadFileName}.)`); // eslint-disable-line
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    _.each(RadGrad.collectionLoadSequence, collection => loadCollection(collection, loadJSON, false));
  }
}

/**
 * A validated method that sets all of the RadGrad collections to their empty state. Only available in test mode.
 */
export const defineTestFixtureMethod = new ValidatedMethod({
  name: 'test.defineTestFixtureMethod',
  validate: null,
  run(fixtureName) {
    defineTestFixture(fixtureName);
  },
});

/**
 * Returns a Promise that resolves when all RadGrad collections subscriptions are ready.
 * @see {@link https://guide.meteor.com/testing.html#full-app-integration-test}
 */
export function withRadGradSubscriptions() {
  return new Promise(resolve => {
    _.each(RadGrad.collections, collection => collection.subscribe());
    const poll = Meteor.setInterval(() => {
      if (DDP._allSubscriptionsReady()) {
        Meteor.clearInterval(poll);
        resolve();
      }
    }, 200);
  });
}

/**
 * Returns a Promise that resolves if one can successfully login with the standard admin username and password.
 */
export function withAdminLogin() {
  return new Promise((resolve, reject) => {
    Meteor.loginWithPassword('radgrad', 'foo', (error) => {
      if (error) {
        reject();
      } else {
        resolve();
      }
    });
  });
}
