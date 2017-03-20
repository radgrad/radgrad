import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { ROLE } from '/imports/api/role/Role';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorAnswerCollection', function testSuite() {
    // Define course data.
    const questionSlug = 'hiring-expectations';
    const text = 'Test answer.';

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      // Define mentor and the question.
      const mentor = makeSampleUser(ROLE.MENTOR);
      const student = makeSampleUser(ROLE.STUDENT);
      MentorQuestions.define({ title: 'Sample Question', slug: questionSlug, student });
      // Now define an answer, passing the defined question and the defined mentor.
      const instanceID = MentorAnswers.define({ question: questionSlug, mentor, text });
      expect(MentorAnswers.isDefined(instanceID)).to.be.true;
      MentorAnswers.removeIt(instanceID);
      expect(MentorAnswers.isDefined(instanceID)).to.be.false;
    });
  });
}
