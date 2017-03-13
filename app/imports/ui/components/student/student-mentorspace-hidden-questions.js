import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Interests } from '../../../api/interest/InterestCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_MentorSpace_Hidden_Questions.onCreated(function studentMentorSpaceHiddenQuestionsOnCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(MentorQuestions.getPublicationName());
  this.subscribe(MentorAnswers.getPublicationName());
  this.subscribe(MentorProfiles.getPublicationName());
  this.subscribe(MentorQuestions.getPublicationName());
  this.subscribe(Users.getPublicationName());
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
    const id = event.target.value;
    MentorQuestions.removeIt(id);
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
