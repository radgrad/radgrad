import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Interests } from './InterestCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('InterestCollection Meteor Methods TestBatch2', function test() {
    const collectionName = Interests.getCollectionName();
    const definitionData = {
      name: 'name',
      slug: 'interest-slug-example',
      interestType: 'cs-disciplines',
      description: 'description',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
      done();
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
      done();
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = Interests.findIdBySlug(definitionData.slug);
          const name = 'updated interest name';
          const description = 'updated description';
          updateMethod.call({ collectionName, updateData: { id, name, description } }, done);
        }).catch(done);
      });
      done();
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
      done();
    });
  });
}
