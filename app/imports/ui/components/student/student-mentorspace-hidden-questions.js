import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_MentorSpace_Hidden_Questions.onCreated(function studentMentorSpaceHiddenQuestionsOnCreated() {
  this.setDefaultQuestion = new ReactiveVar(null);
});

Template.Student_MentorSpace_Hidden_Questions.helpers({
  defaultQuestion() {
    if (Template.instance().setDefaultQuestion.get()) {
      return MentorQuestions.findDoc(Template.instance().setDefaultQuestion.get()).title;
    }
    return '';
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

Template.Student_MentorSpace_Hidden_Questions.events({
  'click .discard': function (event) {
    event.preventDefault();
    const instance = event.target.value;
    const collectionName = MentorQuestions.getCollectionName();
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.log('Error removing MentorQuestion', error);
      }
    });
  },
  'click .edit': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Template.instance().setDefaultQuestion.set(id);
  },

});

Template.Student_MentorSpace_Hidden_Questions.onRendered(function studentMentorSpaceHiddenQuestionsOnRendered() {
  this.$('.ui.accordion').accordion();
});
