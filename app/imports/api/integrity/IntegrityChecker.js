import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { RadGrad } from '../radgrad/RadGrad';

/**
 * Checks the integrity of all the collection classes in RadGrad.
 * @returns {{count: number, message: string}}
 * @memberOf api/integrity
 */
export function checkIntegrity() {
  let message = `Integrity check results (${moment().format('MMM Do YYYY, H:mm:ss a')})`;
  const startTime = moment();
  let count = 0;
  _.forEach(_.sortBy(RadGrad.collections, (c) => c._collectionName), function checkCollection(collection) {
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

/**
 * Checks the integrity of the database, and throws an Error if there are any integrity problems.
 * @returns Null if nothing is wrong.
 * @throws { Meteor.Error } If there is an integrity problem.
 * @memberOf api/integrity
 */
export function assertIntegrity() {
  const { count, message } = checkIntegrity();
  if (count > 0) {
    throw new Meteor.Error(message);
  }
  return null;
}
