import { Meteor } from 'meteor/meteor';
import { careerGoalsDefineMethod, careerGoalsRemoveItMethod } from './CareerGoalCollection.methods';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
import { defineTestFixtureMethod, withRadGradSubscriptions, withAdminLogin } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CareerGoalCollection Meteor Methods', function test() {
    before(done => {
      defineTestFixtureMethod.call('CareerGoals.json', done);
    });

    after(done => {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      const careerDefn = {
        name: 'name',
        slug: 'career-goal-slug',
        description: 'description',
        interests: ['data-science'],
      };
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          careerGoalsDefineMethod.call(careerDefn);
          done();
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      const careerDefn = {
        name: 'name',
        slug: 'career-goal-slug2',
        description: 'description',
        interests: ['data-science'],
      };
      withAdminLogin().then(() => {
        withRadGradSubscriptions().then(() => {
          console.log('meteor user', Meteor.userId());
          careerGoalsDefineMethod.call(careerDefn, (error, docID) => {
            console.log('meteor user2', Meteor.userId());
            careerGoalsRemoveItMethod.call(docID, (error2, result2) => {
              console.log('after remove it', error2, result2);
            });
          });
          done();
        }).catch(done);
      });
    });
  });
}
