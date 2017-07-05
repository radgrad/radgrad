import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Opportunities } from './OpportunityCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('OpportunityCollection Meteor Methods TestBatch2', function test() {
    const collectionName = Opportunities.getCollectionName();
    const definitionData = {
      name: 'name',
      slug: 'opportunity-slug-example',
      description: 'description',
      opportunityType: 'club',
      sponsor: 'radgrad',
      ice: { i: 5, c: 5, e: 5 },
      interests: ['algorithms'],
      semesters: ['Spring-2017'],
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'opportunities'], done);
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
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = Opportunities.findIdBySlug(definitionData.slug);
          const description = 'updated description';
          updateMethod.call({ collectionName, updateData: { id, description } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
    });
  });
}
