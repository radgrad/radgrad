import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CareerGoals } from './CareerGoalCollection';
import { defineTestFixtureMethod, withRadGradSubscriptions, withAdminLogin } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CareerGoalCollection Meteor Methods', function test() {
    const careerDefn = {
      name: 'name',
      slug: 'career-goal-slug',
      description: 'description',
      interests: ['data-science'],
    };

    before(done => {
      defineTestFixtureMethod.call('CareerGoals.json', done);
    });

    after(done => {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName: 'CareerGoalCollection', definition: careerDefn });
          done();
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = CareerGoals.findIdBySlug(careerDefn.slug);
          updateMethod.call({ collectionName: 'CareerGoalCollection', updateFields: { id, name: 'new name' } });
          done();
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName: 'CareerGoalCollection', instance: careerDefn.slug });
          done();
        }).catch(done);
      });
    });
  });
}
