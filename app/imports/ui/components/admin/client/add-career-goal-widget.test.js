import { Template } from 'meteor/templating';
// import { expect } from 'chai';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import * as CareerGoalMethods from '../../../../api/career/CareerGoalCollection.methods';
// import { resetDatabaseMethod } from '../../../../api/base/BaseCollection.methods';
import { makeSampleInterest } from '../../../../api/interest/SampleInterests';
import { Interests } from '../../../../api/interest/InterestCollection';
import '../../../../api/career';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */


describe('Add_Career_Goal_Widget', function test() {
  this.timeout(0);

  beforeEach(function () {
    Template.registerHelper('_', key => key);
    // resetDatabaseMethod.call(null);
  });

  afterEach(function () {
    Template.deregisterHelper('_');
    // resetDatabaseMethod.call(null);
  });
  it.skip('careerGoalDefineMethod', function (done) {
    const interestID = makeSampleInterest();
    const interestSlug = Interests.findSlugByID(interestID);
    const careerDefn = {
      name: 'career goal definition test',
      slug: 'career-goal-slug',
      description: 'career goal definition test description',
      interests: [interestSlug],
    };
    CareerGoalMethods.careerGoalsDefineMethod.call(careerDefn, (error, result) => {
      console.log(`CareerGoals Define callback error="${error}" result="${result}"`);
      const numGoals = CareerGoals.find().count();
      console.log(CareerGoals.findDoc(result), numGoals);
      // expect(numGoals).to.equal(1);
      done();
    });
  });
});
