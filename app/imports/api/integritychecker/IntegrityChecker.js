import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

/**
 * Each RadGrad collection class instance must add itself to this array so that its checkIntegrity mechanism
 * will be called.
 * @type {Array} An array of RadGrad collection class instances.
 */
export const radgradCollections = [];

export function checkIntegrity() {
  let integrityResults = `\nStarting integrity check at ${moment().format('LLL')}`;
  let numProblems = 0;
  _.forEach(radgradCollections, function checkCollection(collection) {
    integrityResults += `\n  ${collection._collectionName} (${collection.count()})`;
    const collectionStrings = collection.checkIntegrity();
    _.forEach(collectionStrings, function addString(collectionString) {
      numProblems += 1;
      integrityResults += `\n    ${collectionString}`;
    });
  });
  integrityResults += `\nTotal problems: ${numProblems}`;
  console.log(integrityResults);
}
