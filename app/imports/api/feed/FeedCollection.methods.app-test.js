import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Feeds } from './FeedCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FeedCollection Meteor Methods ', function test() {
    const collectionName = Feeds.getCollectionName();
    let docID;

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('Define Method (new-user)', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = { user: 'abi@hawaii.edu', feedType: Feeds.NEW_USER };
      docID = await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = docID;
      const description = 'updated Feed description';
      await updateMethod.callPromise({ collectionName, updateData: { id, description } });
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: docID });
    });
  });
}
