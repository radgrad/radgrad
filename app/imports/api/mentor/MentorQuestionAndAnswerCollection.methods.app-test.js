import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorQuestionAndAnswerCollection Meteor Methods TestBatch2 foo', function test() {
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

    it('Define Method (Question)', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName: questionCollectionName, definitionData: questionDefinition });
    });

    it('Define Method (Answer)', async function () {
      await defineMethod.callPromise({ collectionName: answerCollectionName, definitionData: answerDefinition });
    });

    it('Question Update Method', async function () {
      const id = MentorQuestions.findIdBySlug(questionDefinition.slug);
      const question = 'updated CareerGoal name';
      const student = 'abi@hawaii.edu';
      const moderated = true;
      const visible = false;
      const moderatorComments = 'comments';
      await updateMethod.callPromise({
        collectionName: questionCollectionName,
        updateData: { id, question, student, moderated, visible, moderatorComments },
      });
    });

    it('Answer Update Method', async function () {
      const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
      const id = MentorAnswers.findDoc({ questionID })._id;
      const text = 'updated answer text';
      await updateMethod.callPromise({ collectionName: answerCollectionName, updateData: { id, text } });
    });

    it.skip('Question Remove Method', async function () {
      const instance = MentorQuestions.findIdBySlug(questionDefinition.slug);
      await removeItMethod.callPromise({ collectionName: questionCollectionName, instance });
    });

    it.skip('Answer Remove Method', async function () {
      const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
      const instance = MentorAnswers.findDoc({ questionID })._id;
      await removeItMethod.callPromise({ collectionName: answerCollectionName, instance });
    });
  });
}
