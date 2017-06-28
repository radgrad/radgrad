import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '../user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorQuestionCollection', function testSuite() {
    let question;
    let slug;
    let student;

    before(function setup() {
      removeAllEntities();
      question = 'Test question.';
      slug = 'test-mentor-question';
      student = makeSampleUser();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = MentorQuestions.define({ question, slug, student });
      expect(MentorQuestions.isDefined(instanceID)).to.be.true;
      MentorQuestions.removeIt(instanceID);
      expect(MentorQuestions.isDefined(instanceID)).to.be.false;
    });
  });
}
