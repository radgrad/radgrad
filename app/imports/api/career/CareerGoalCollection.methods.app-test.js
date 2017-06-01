import { Meteor } from 'meteor/meteor';
import { CareerGoals } from './CareerGoalCollection';
import { careerGoalsDefineMethod } from './CareerGoalCollection.methods';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
import { defineTestFixtureMethod } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CareerGoalCollection.defineMethod', function test() {

    before(function (done) {
      defineTestFixtureMethod.call('CareerGoals.json', done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('careerGoalDefineMethod', function (done) {
      const careerDefn = {
        name: 'career goal definition test',
        slug: 'career-goal-slug',
        description: 'career goal definition test description',
        interests: ['data-science'],
      };
      careerGoalsDefineMethod.call(careerDefn, (error, result) => {
        console.log(`CareerGoals Define callback error="${error}" result="${result}"`);
        const numGoals = CareerGoals.find().count();
        console.log(CareerGoals.findDoc(result), numGoals);
        done();
      });
    });
  });
}
