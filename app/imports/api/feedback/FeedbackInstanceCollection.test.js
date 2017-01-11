/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { FeedbackInstances } from '/imports/api/feedback/FeedbackInstanceCollection';
import { makeSampleFeedback } from '/imports/api/feedback/SampleFeedbacks';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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
      const feedback = makeSampleFeedback();
      const description = 'foo';
      const area = 'Interests';
      const docID = FeedbackInstances.define({ feedback, user, description, area });
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      FeedbackInstances.removeIt(docID);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
    });
  });
}

