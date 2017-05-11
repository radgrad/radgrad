import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Mentor_MentorSpace_Answer_Form.onCreated(function mentorMentorSpaceAnswerFormOnCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  if (this.data.answering) {
    this.answering = this.data.answering;
  }
});

Template.Mentor_MentorSpace_Answer_Form.helpers({
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
    const newAnswer = { question, mentor: getUserIdFromRoute(), text: answer };
    MentorAnswers.define(newAnswer);
    instance.messageFlags.set(displaySuccessMessage, true);
    instance.messageFlags.set(displayErrorMessages, false);
    event.target.reset();
  },
  'click .discard': function () {
    Template.instance().answering.set(false);
  },
  'click .edit': function (event) {
    event.preventDefault();
  },

});

Template.Mentor_MentorSpace_Answer_Form.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion();
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.rating').rating();
});
