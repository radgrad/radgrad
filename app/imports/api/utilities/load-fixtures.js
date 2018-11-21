import { _ } from 'meteor/erasaur:meteor-lodash';
import { getDefinitions } from '../test/test-utilities';
import { Slugs } from '../slug/SlugCollection';

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on the definitions
 * that are not in the collection.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 * @memberOf api/utilities
 */
export function loadCollectionNewDataOnly(collection, loadJSON, consolep) {
  const type = collection.getType();
  // console.log(`loadCollectionNewDataOnly(${type}, ${loadJSON}`);
  const definitions = getDefinitions(loadJSON, collection._collectionName);
  // console.log(`${definitions.length} definitions for ${type}`);
  let count = 0;
  _.each(definitions, definition => {
    if ('slug' in definition) {
      if (!Slugs.isDefined(definition.slug, type)) {
        collection.define(definition);
        count++;
      }
    } // CAM: what do we do if it doesn't have a slug?.
  });
  let ret;
  if (count > 1) {
    ret = `Defined ${count} ${type}s`;
  } else if (count === 1) {
    ret = `Defined a ${type}`;
  } else {
    ret = '';
  }
  if (consolep) {
    // console.log(count, `<${ret}>`);
  }
  return ret;
}
