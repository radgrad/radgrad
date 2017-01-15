import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorQuestions } from './MentorQuestionCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorQuestionCollection', function testSuite() {
    const title = 'Test question.';
    const slug = 'test-mentor-question';

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = MentorQuestions.define({ title, slug, approved: true });
      expect(MentorQuestions.isDefined(instanceID)).to.be.true;
      MentorQuestions.removeIt(instanceID);
      expect(MentorQuestions.isDefined(instanceID)).to.be.false;
    });
  });
}
