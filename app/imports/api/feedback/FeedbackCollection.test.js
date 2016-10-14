/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';
import { FeedbackType } from '/imports/api/feedback/FeedbackType';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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

    it('#define, #isDefined, #removeIt', function test() {
      Feedbacks.define({ name, slug, description, feedbackType });
      expect(Feedbacks.isDefined(slug)).to.be.true;
      Feedbacks.removeIt(slug);
      expect(Feedbacks.isDefined(slug)).to.be.false;
    });
  });
}

