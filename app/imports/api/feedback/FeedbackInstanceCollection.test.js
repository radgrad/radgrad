/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { makeSampleFeedback } from '../feedback/SampleFeedbacks';
import { makeSampleUser } from '../user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';

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
      let docID = FeedbackInstances.define({ feedback, user, description, area });
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      const dumpObject = FeedbackInstances.dumpOne(docID);
      FeedbackInstances.removeIt(docID);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
      docID = FeedbackInstances.restoreOne(dumpObject);
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      FeedbackInstances.removeIt(docID);
    });
  });
}

