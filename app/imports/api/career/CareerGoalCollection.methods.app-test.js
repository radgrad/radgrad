import { Meteor } from 'meteor/meteor';
import { careerGoalsDefineMethod, careerGoalsRemoveItMethod } from './CareerGoalCollection.methods';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
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
          careerGoalsDefineMethod.call(careerDefn);
          done();
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          careerGoalsRemoveItMethod.call('career-goal-slug');
          done();
        }).catch(done);
      });
    });
  });
}
