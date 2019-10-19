import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorQuestionAndAnswerCollection Meteor Methods ', function test() {
    // this.timeout(10000);
    const questionCollectionName = MentorQuestions.getCollectionName();
    const questionDefinition = {
      question: 'question',
      slug: 'test-question',
      student: 'abi@hawaii.edu',
    };
    const answerCollectionName = MentorAnswers.getCollectionName();
    const answerDefinition = {
      question: 'test-question',
      mentor: 'rbrewer@gmail.com',
      text: 'mentor-answer',
    };

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'rbrewer.mentor'], done);
    });

    it.skip('Define (Question, Answer)', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const questionID = await defineMethod.callPromise({
        collectionName: questionCollectionName,
        definitionData: questionDefinition,
      });
      expect(MentorQuestions.isDefined(questionID)).to.be.true;
      const answerID = await defineMethod.callPromise({
        collectionName: answerCollectionName,
        definitionData: answerDefinition,
      });
      expect(MentorAnswers.isDefined(answerID)).to.be.true;
    });

    it.skip('Question Update Method', async function () {
      const id = MentorQuestions.findIdBySlug(questionDefinition.slug);
      const question = 'updated CareerGoal name';
      const student = 'abi@hawaii.edu';
      const moderated = true;
      const visible = false;
      const moderatorComments = 'comments';
      await updateMethod.callPromise({
        collectionName: questionCollectionName,
        updateData: {
          id, question, student, moderated, visible, moderatorComments,
        },
      });
      const doc = MentorQuestions.findDoc(id);
      expect(doc.question).to.equal(question);
    });

    it.skip('Answer Update Method', async function () {
      const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
      console.log(questionID);
      const id = MentorAnswers.findDoc({ questionID })._id;
      const text = 'updated answer text';
      await updateMethod.callPromise({ collectionName: answerCollectionName, updateData: { id, text } });
      const doc = MentorAnswers.findDoc(id);
      expect(doc.text).to.equal(text);
    });

    it.skip('Question & Answer Remove Methods', async function () {
      const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
      const answerID = MentorAnswers.findDoc({ questionID })._id;
      await removeItMethod.callPromise({ collectionName: answerCollectionName, instance: answerID });
      expect(MentorAnswers.isDefined(answerID)).to.be.false;
      await removeItMethod.callPromise({ collectionName: questionCollectionName, instance: questionID });
      expect(MentorQuestions.isDefined(questionID)).to.be.false;
    });
  });
}
