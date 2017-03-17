import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorQuestionCollection', function testSuite() {
    let title;
    let slug;
    let student;

    before(function setup() {
      removeAllEntities();
      title = 'Test question.';
      slug = 'test-mentor-question';
      student = makeSampleUser();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = MentorQuestions.define({ title, slug, student });
      expect(MentorQuestions.isDefined(instanceID)).to.be.true;
      MentorQuestions.removeIt(instanceID);
      expect(MentorQuestions.isDefined(instanceID)).to.be.false;
    });
  });
}
