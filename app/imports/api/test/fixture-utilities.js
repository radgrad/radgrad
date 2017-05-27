import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

/** @module api/utility/fixture-utilities */

/**
 * The restore/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 */
export const restoreFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the restore file was created. Parses the file name string.
 * @param restoreFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 */
export function getRestoreFileAge(restoreFileName) {
  const terms = _.words(restoreFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, restoreFileDateFormat).fromNow();
}

/**
 * Returns the definition array associated with collectionName in the restoreJSON structure,
 * or an empty array if none was found.
 * @param restoreJSON The restore file contents.
 * @param collection The collection of interest.
 */
function getDefinitions(restoreJSON, collection) {
  const definitionObj = _.find(restoreJSON.collections, obj => obj.name === collection);
  return definitionObj ? definitionObj.contents : [];
}

/**
 * Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be restored.
 * @param restoreJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 */
export function restoreCollection(collection, restoreJSON, consolep) {
  const definitions = getDefinitions(restoreJSON, collection._collectionName);
  if (consolep) {
    console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`); // eslint-disable-line
  }
  _.each(definitions, definition => collection.define(definition));
}
