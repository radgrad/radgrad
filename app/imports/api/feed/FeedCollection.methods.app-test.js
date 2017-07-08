import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Feeds } from './FeedCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FeedCollection Meteor Methods  TestBatch1', function test() {
    const collectionName = Feeds.getCollectionName();
    let docID;

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
      done();
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
      done();
    });

    it('Define Method (new-user)', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const definitionData = { user: 'abi@hawaii.edu', feedType: 'new-user' };
          docID = defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
      done();
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = docID;
          const description = 'updated Feed description';
          updateMethod.call({ collectionName, updateData: { id, description } }, done);
        }).catch(done);
      });
      done();
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: docID }, done);
        }).catch(done);
      });
      done();
    });
  });
}
