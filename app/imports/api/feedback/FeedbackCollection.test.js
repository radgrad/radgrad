import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Feedbacks } from '../feedback/FeedbackCollection';
import { FeedbackType } from '../feedback/FeedbackType';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedbackCollection', function testSuite() {
    const name = 'Sample Feedback';
    const slug = 'sampleFeedback';
    const description = 'A feedback for testing purposes only.';
    const feedbackType = FeedbackType.RECOMMENDATION;

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const docID = Feedbacks.define({ name, slug, description, feedbackType });
      expect(Feedbacks.isDefined(slug)).to.be.true;
      const dumpObject = Feedbacks.dumpOne(docID);
      Feedbacks.removeIt(slug);
      expect(Feedbacks.isDefined(slug)).to.be.false;
      Feedbacks.restoreOne(dumpObject);
      expect(Feedbacks.isDefined(slug)).to.be.true;
      Feedbacks.removeIt(slug);
    });
  });
}

