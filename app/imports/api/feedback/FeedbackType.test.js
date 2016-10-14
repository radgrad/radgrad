/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { expect } from 'chai';
import { FeedbackType, isFeedbackType, assertFeedbackType } from '/imports/api/feedback/FeedbackType';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('FeedbackType', function testSuite() {
    it('Test FeedbackType constants, isFeedbackType', function test() {
      expect(FeedbackType.RECOMMENDATION).to.be.ok;
      expect(FeedbackType.WARNING).to.be.ok;
      expect(isFeedbackType(FeedbackType.WARNING)).to.be.true;
      expect(isFeedbackType('foo')).to.be.false;
    });

    it('assertFeedbackType', function test() {
      expect(function foo() { assertFeedbackType(FeedbackType.WARNING);}).to.not.throw(Error);
      expect(function foo() { assertFeedbackType('foo');}).to.throw(Error);
    });
  });
}
