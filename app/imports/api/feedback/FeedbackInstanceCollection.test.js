import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedbackInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #removeIt, #dumpOne, #restoreOne', function test() {
      const user = makeSampleUser();
      const functionName = 'checkPrerequisites';
      const description = 'The prereqs for ICS 314 were not satisfied.';
      const feedbackType = FeedbackInstances.WARNING;
      let docID = FeedbackInstances.define({ user, functionName, description, feedbackType });
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      const dumpObject = FeedbackInstances.dumpOne(docID);
      FeedbackInstances.removeIt(docID);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
      docID = FeedbackInstances.restoreOne(dumpObject);
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      FeedbackInstances.removeIt(docID);
    });

    it('#clear', function test() {
      const user = makeSampleUser();
      const functionName = 'checkPrerequisites';
      const description = 'The prereqs for ICS 314 were not satisfied.';
      const feedbackType = FeedbackInstances.RECOMMENDATION;
      const docID = FeedbackInstances.define({ user, functionName, description, feedbackType });
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      FeedbackInstances.clear(user, functionName);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
    });
  });
}

