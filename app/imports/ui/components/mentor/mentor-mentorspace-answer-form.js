import { Template } from 'meteor/templating';
import { defineMethod, updateMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

Template.Mentor_MentorSpace_Answer_Form.helpers({
  existingAnswer() {
    const questionID = this.questionID;
    const existingAnswers = MentorAnswers.find({ questionID, mentorID: getUserIdFromRoute() }).fetch();
    return (existingAnswers.length > 0) ? existingAnswers[0].text : '';
  },
});

Template.Mentor_MentorSpace_Answer_Form.events({
  'submit .mentorspace-answer-form': function (event) {
    event.preventDefault();
    const answer = event.target.msanswer.value;
    const question = this.questionID;
    const collectionName = MentorAnswers.getCollectionName();
    const newAnswer = { question, mentor: getUserIdFromRoute(), text: answer };
    const existingAnswers = MentorAnswers.find({ questionID: question, mentorID: getUserIdFromRoute() }).fetch();
    const answerExists = (existingAnswers.length > 0);
    if (answerExists) {
      newAnswer.id = existingAnswers[0]._id;
      updateMethod.call({ collectionName, updateData: newAnswer }, (error) => {
        if (error) console.log('error in MentorAnswers.update', error);
      });
      const message = `${getRouteUserName()} updated their answer to ${question} with ${answer}.`;
      appLog.info(message);
    } else {
      defineMethod.call({ collectionName, definitionData: newAnswer }, (error) => {
        if (error) console.log('error in MentorAnswers.define', error);
      });
      const message = `${getRouteUserName()} answered ${question} with ${answer}.`;
      appLog.info(message);
    }
  },
  'click .delete': function (event) {
    event.preventDefault();
    const questionID = this.questionID;
    const collectionName = MentorAnswers.getCollectionName();
    const instance = MentorAnswers.findDoc({ questionID, mentorID: getUserIdFromRoute() })._id;
    removeItMethod.call({ collectionName, instance });
  },
});

Template.Mentor_MentorSpace_Answer_Form.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion();
});
