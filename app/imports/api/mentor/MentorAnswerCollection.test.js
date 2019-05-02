import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';

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

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      // Define mentor and the question.
      const mentor = makeSampleUser(ROLE.MENTOR);
      const student = makeSampleUser(ROLE.STUDENT);
      MentorQuestions.define({ question: 'Sample Question', slug: questionSlug, student });
      // Now define an answer, passing the defined question and the defined mentor.
      let docID = MentorAnswers.define({ question: questionSlug, mentor, text });
      expect(MentorAnswers.isDefined(docID)).to.be.true;
      let dumpObject = MentorAnswers.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(MentorAnswers.findNonRetired().length).to.equal(1);
      MentorAnswers.update(docID, { retired: true });
      expect(MentorAnswers.findNonRetired().length).to.equal(0);
      MentorAnswers.removeIt(docID);
      expect(MentorAnswers.isDefined(docID)).to.be.false;
      docID = MentorAnswers.define(dumpObject);
      expect(MentorAnswers.isDefined(docID)).to.be.true;
      MentorAnswers.update(docID, { retired: true });
      dumpObject = MentorAnswers.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      MentorAnswers.removeIt(docID);
      docID = MentorAnswers.define(dumpObject);
      expect(MentorAnswers.isDefined(docID)).to.be.true;
    });

    it('#removeQuestion, #removeUser', function test() {
      // Define mentor and the question.
      const mentor1 = makeSampleUser(ROLE.MENTOR);
      const mentor2 = makeSampleUser(ROLE.MENTOR);
      const student = makeSampleUser(ROLE.STUDENT);
      MentorQuestions.define({ question: 'Sample Question', slug: `${questionSlug}-1`, student });
      MentorQuestions.define({ question: 'Sample Question2', slug: `${questionSlug}-2`, student });
      const answer11ID = MentorAnswers.define({ question: `${questionSlug}-1`, mentor: mentor1, text });
      const answer21ID = MentorAnswers.define({ question: `${questionSlug}-1`, mentor: mentor2, text });
      const answer12ID = MentorAnswers.define({ question: `${questionSlug}-2`, mentor: mentor1, text });
      const answer22ID = MentorAnswers.define({ question: `${questionSlug}-2`, mentor: mentor2, text });
      expect(MentorAnswers.isDefined(answer11ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer21ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer12ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer22ID)).to.be.true;
      MentorAnswers.removeQuestion(`${questionSlug}-1`);
      expect(MentorAnswers.isDefined(answer11ID)).to.be.false;
      expect(MentorAnswers.isDefined(answer21ID)).to.be.false;
      MentorAnswers.removeUser(mentor2);
      expect(MentorAnswers.isDefined(answer12ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer22ID)).to.be.false;
    });
  });
}
