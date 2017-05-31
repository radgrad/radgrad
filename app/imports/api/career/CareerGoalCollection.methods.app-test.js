import { Meteor } from 'meteor/meteor';
import { CareerGoals } from './CareerGoalCollection';
import { careerGoalsDefineMethod } from './CareerGoalCollection.methods';
import { makeSampleInterest } from '../interest/SampleInterests';
import { Interests } from '../interest/InterestCollection';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CareerGoalCollection.defineMethod', function test() {

    beforeEach(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    afterEach(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('careerGoalDefineMethod', function (done) {
      const interestID = makeSampleInterest();
      const interestSlug = Interests.findSlugByID(interestID);
      const careerDefn = {
        name: 'career goal definition test',
        slug: 'career-goal-slug',
        description: 'career goal definition test description',
        interests: [interestSlug],
      };
      careerGoalsDefineMethod.call(careerDefn, (error, result) => {
        console.log(`CareerGoals Define callback error="${error}" result="${result}"`);
        const numGoals = CareerGoals.find().count();
        console.log(CareerGoals.findDoc(result), numGoals);
        // expect(numGoals).to.equal(1);
        done();
      });
    });
  });
}
