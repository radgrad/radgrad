import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import { CareerGoals } from './CareerGoalCollection';
import { Interests } from '../interest/InterestCollection';
import { Slugs } from '../slug/SlugCollection';
import { careerGoalsDefineMethod } from './CareerGoalCollection.methods';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
import { defineTestFixtureMethod } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

// Utility -- returns a promise which resolves when all subscriptions are done
const waitForSubscriptions = () => new Promise(resolve => {
  CareerGoals.subscribe();
  Interests.subscribe();
  Slugs.subscribe();
  const poll = Meteor.setInterval(() => {
    if (DDP._allSubscriptionsReady()) {
      Meteor.clearInterval(poll);
      resolve();
    }
  }, 200);
});

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
      waitForSubscriptions().then(() => {
        careerGoalsDefineMethod.call(careerDefn, (error, result) => {
          console.log(`CareerGoals Define callback error="${error}" result="${result}"`);
          const numGoals = CareerGoals.find().count();
          console.log(CareerGoals.findDoc(result), numGoals);
        });
        done();
      });
    });
  });
}
