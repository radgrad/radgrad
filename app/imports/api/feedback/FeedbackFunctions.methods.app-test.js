import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FeedbackFunctions } from './FeedbackFunctions';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('Feedback Functions Meteor Methods ', function test() {
    // const collectionName = FeedbackInstances.getCollectionName();

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student',
        'extended.courses.interests', 'academicplan', 'abi.courseinstances'], done);
    });

    it.skip('checkPrerequisites', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      FlowRouter.go('/student/abi/degree-planner');
      FlowRouter.setParams({ username: 'abi@hawaii.edu' });
      // This might need to be converted to a promise in order to work with async/await.
      FeedbackFunctions.checkPrerequisites('abi@hawaii.edu');
    });
  });
}
