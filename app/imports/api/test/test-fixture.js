import { _ } from 'meteor/erasaur:meteor-lodash';
import { restoreCollection } from './fixture-utilities';
import { RadGrad } from '../../api/radgrad/radgrad';

/* global Assets */

/** @module api/test/test-fixture */

// TODO rewrite this to use RadGrad.collections and to not be copy-pasted from the DB restoration code.
/**
 *
 */
export function defineTestFixture(fixtureName) {
  const restoreFileName = `database/testing/${fixtureName}`;
  console.log(`    (Restoring test fixture from file ${restoreFileName}.)`); // eslint-disable-line
  const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
  // The list of collections, ordered so that they can be sequentially restored.
  const collectionList = RadGrad.collectionLoadSequence;
  _.each(collectionList, collection => restoreCollection(collection, restoreJSON, false));
}
