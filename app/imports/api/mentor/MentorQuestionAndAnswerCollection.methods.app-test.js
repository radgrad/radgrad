import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorQuestionAndAnswerCollection Meteor Methods', function test() {
    // this.timeout(10000);
    const questionCollectionName = MentorQuestions.getCollectionName();
    const questionDefinition = {
      question: 'question',
      slug: 'test-question',
      student: 'abi',
    };
    const answerCollectionName = MentorAnswers.getCollectionName();
    const answerDefinition = {
      question: 'test-question',
      mentor: 'brewer',
      text: 'mentor-answer',
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user', 'brewer.user'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Question Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName: questionCollectionName, definitionData: questionDefinition }, done);
        }).catch(done);
      });
    });

    it('Answer Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName: answerCollectionName, definitionData: answerDefinition }, done);
        }).catch(done);
      });
    });

    it('Question Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = MentorQuestions.findIdBySlug(questionDefinition.slug);
          const question = 'updated CareerGoal name';
          const student = 'abi';
          const moderated = true;
          const visible = false;
          const moderatorComments = 'comments';
          updateMethod.call({ collectionName: questionCollectionName,
            updateData: { id, question, student, moderated, visible, moderatorComments } }, done);
        }).catch(done);
      });
    });

    it('Answer Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
          const id = MentorAnswers.findDoc({ questionID })._id;
          const text = 'updated answer text';
          updateMethod.call({ collectionName: answerCollectionName,
            updateData: { id, text } }, done);
        }).catch(done);
      });
    });

    it.skip('Question Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = MentorQuestions.findIdBySlug(questionDefinition.slug);
          removeItMethod.call({ collectionName: questionCollectionName, instance }, done);
        }).catch(done);
      });
    });

    it.skip('Answer Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const questionID = MentorQuestions.findIdBySlug(questionDefinition.slug);
          const instance = MentorAnswers.findDoc({ questionID })._id;
          removeItMethod.call({ collectionName: answerCollectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
