import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import {
  mentorQuestionsDefineMethod,
  mentorQuestionsUpdateMethod,
} from '../../../api/mentor/MentorQuestionCollection.methods';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Student_MentorSpace_Question_Form.onCreated(function studentMentorSpaceMentorQuestionFormOnCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.setDefaultQuestion = new ReactiveVar(null);
});

Template.Student_MentorSpace_Question_Form.helpers({
  defaultQuestion() {
    if (Template.instance().setDefaultQuestion.get()) {
      return MentorQuestions.findDoc(Template.instance().setDefaultQuestion.get()).title;
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
  moderated(question) {
    let color;
    let icon;
    let message;
    if (question.moderated === true) {
      color = 'negative';
      icon = 'yellow warning sign';
      message = `Your question has been hidden because: ${question.moderatorComments}`;
    } else {
      color = 'warning';
      icon = 'green checkmark';
      message = 'Your question has not yet been moderated.';
    }
    return { color, icon, message };
  },
  questions() {
    return MentorQuestions.find({ studentID: getUserIdFromRoute(), visible: false }).fetch();
  },
});

Template.Student_MentorSpace_Question_Form.events({
  'submit .mentorspace-question-form': function (event, instance) {
    event.preventDefault();
    const question = event.target.msquestion.value;
    if (Template.instance().setDefaultQuestion.get()) {
      const questionDoc = MentorQuestions.findDoc(Template.instance().setDefaultQuestion.get());
      // There's gotta be a better way of doing this.
      const data = {};
      _.mapKeys(questionDoc, (value, key) => {
        if (key !== '_id') {
          data[key] = value;
        }
      });
      data.id = questionDoc._id;
      data.question = question;
      mentorQuestionsUpdateMethod.call(data, (error) => {
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
    } else {
      const mentorQuestion = { title: question, student: getRouteUserName() };
      mentorQuestionsDefineMethod.call(mentorQuestion, (error) => {
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
    }
    instance.messageFlags.set(displaySuccessMessage, true);
    instance.messageFlags.set(displayErrorMessages, false);
    event.target.reset();
  },
  'click .discard': function () {
    Template.instance().setDefaultQuestion.set(false);
  },
  'click .edit': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Template.instance().setDefaultQuestion.set(id);
  },

});

Template.Student_MentorSpace_Question_Form.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion();
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.rating').rating();
});
