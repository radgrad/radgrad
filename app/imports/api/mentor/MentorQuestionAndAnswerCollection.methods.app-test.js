import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorQuestionAndAnswerCollection Meteor Methods', function test() {
    const answerCollectionName = MentorAnswers.getCollectionName();
    const questionCollectionName = MentorQuestions.getCollectionName();
    const answerDefinition = {

    };
    const questionDefinition = {
      question: 'question',
      slug: 'test-question',
      student: 'abi',
      moderated: false,
      visible: false,
      moderatorComments: '',
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user'], done);
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
          updateMethod.call({ collectionName: answerCollectionName,
            updateData: { id, question, student, moderated, visible, moderatorComments } }, done);
        }).catch(done);
      });
    });

    it('Answer Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = MentorAnswers.findIdBySlug(answerDefinition.slug);
          const name = 'updated CareerGoal name';
          const description = 'updated CareerGoal description';
          const interests = ['algorithms', 'java'];
          const prerequisites = ['ics_111', 'ics_141'];
          updateMethod.call({ collectionName: answerCollectionName,
            updateData: { id, name, description, interests, prerequisites } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ answerCollectionName, instance: answerDefinition.slug }, done);
        }).catch(done);
      });
    });
  });
}
