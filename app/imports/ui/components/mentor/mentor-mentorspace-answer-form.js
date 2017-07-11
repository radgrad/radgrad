import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

// /** @module ui/components/mentor/Mentor_MentorSpace_Answer_Form */

Template.Mentor_MentorSpace_Answer_Form.onCreated(function mentorMentorSpaceAnswerFormOnCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  if (this.data.answering) {
    this.answering = this.data.answering;
  }
});

Template.Mentor_MentorSpace_Answer_Form.helpers({
  existingAnswer() {
    const questionID = Template.instance().answering.get();
    const answer = MentorAnswers.find({ questionID, userID: getUserIdFromRoute() }).fetch();
    if (answer.length > 0) {
      return answer[0].text;
    }
    return '';
  },
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
});

Template.Mentor_MentorSpace_Answer_Form.events({
  'submit .mentorspace-answer-form': function (event, instance) {
    event.preventDefault();
    const answer = event.target.msanswer.value;
    const question = instance.answering.get();
    const collectionName = MentorAnswers.getCollectionName();
    const newAnswer = { question, mentor: getUserIdFromRoute(), text: answer };
    const existingAnswer = MentorAnswers.findDoc({ questionID: question, userID: getUserIdFromRoute() });
    if (answer.length > 0) {
      newAnswer.id = existingAnswer._id;
      updateMethod.call({ collectionName, updateData: newAnswer }, (error) => {
        if (error) {
          instance.messageFlags.set(displaySuccessMessage, false);
          instance.messageFlags.set(displayErrorMessages, true);
          event.target.reset();
        } else {
          instance.messageFlags.set(displaySuccessMessage, true);
          instance.messageFlags.set(displayErrorMessages, false);
          event.target.reset();
        }
      });
      const message = `${getRouteUserName()} updated their answer to ${question} with ${answer}.`;
      appLog.info(message);
    } else {
      defineMethod.call({ collectionName, definitionData: newAnswer }, (error) => {
        if (error) {
          instance.messageFlags.set(displaySuccessMessage, false);
          instance.messageFlags.set(displayErrorMessages, true);
          event.target.reset();
        } else {
          instance.messageFlags.set(displaySuccessMessage, true);
          instance.messageFlags.set(displayErrorMessages, false);
          event.target.reset();
        }
      });
      const message = `${getRouteUserName()} answered ${question} with ${answer}.`;
      appLog.info(message);
    }
  },
  'click .cancel': function (event) {
    event.preventDefault();
    Template.instance().answering.set(false);
  },
});

Template.Mentor_MentorSpace_Answer_Form.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion();
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.rating').rating();
});
