import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
import { FeedbackFunctions } from './FeedbackFunctions';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('Feedback Functions Meteor Methods', function test() {
    // const collectionName = FeedbackInstances.getCollectionName();

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user',
        'extended.courses.interests', 'academicplan', 'abi.courseinstances'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it.skip('checkPrerequisites', function (done) {
      withLoggedInUser({ username: 'abi' }).then(() => {
        withRadGradSubscriptions().then(() => {
          FlowRouter.go('/student/abi/degree-planner');
          FlowRouter.setParams({ username: 'abi' });
          FeedbackFunctions.checkPrerequisites('abi');
        }).catch(done);
      });
    });
  });
}
