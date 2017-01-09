import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

/**
 * Each RadGrad collection class instance must add itself to this array so that its checkIntegrity mechanism
 * will be called.
 * @type {Array} An array of RadGrad collection class instances.
 */
export const radgradCollections = [];

export function checkIntegrity() {
  let message = `Integrity check results (${moment().format('MMM Do YYYY, H:mm:ss a')})`;
  const startTime = moment();
  let count = 0;
  _.forEach(_.sortBy(radgradCollections, (c) => c._collectionName), function checkCollection(collection) {
    message += `\n  ${collection._collectionName} (${collection.count()})`;
    const collectionStrings = collection.checkIntegrity();
    _.forEach(collectionStrings, function addString(collectionString) {
      count += 1;
      message += `\n    ${collectionString}`;
    });
  });
  message += `\nTotal problems: ${count}`;
  const endTime = moment();
  message += `\nElapsed time: ${endTime.diff(startTime, 'seconds', true)} seconds`;
  return { count, message };
}
