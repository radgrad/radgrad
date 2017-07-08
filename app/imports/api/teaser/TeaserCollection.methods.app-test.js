import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Teasers } from './TeaserCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('TeaserCollection Meteor Methods TestBatch2', function test() {
    const collectionName = Teasers.getCollectionName();
    const definitionData = {
      title: 'name',
      slug: 'opportunity-slug-example',
      author: 'Amy',
      opportunity: 'acm-manoa',
      url: 'http://cnn.com',
      interests: ['algorithms'],
      description: 'description',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'opportunities'], done);
      done();
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
      done();
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
          const id = Teasers.findIdBySlug(definitionData.slug);
          const description = 'updated description';
          updateMethod.call({ collectionName, updateData: { id, description } }, done);
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
