import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Mentor_MentorSpace_Page.onCreated(function mentorMentorSpacePageOnCreated() {
  this.answering = new ReactiveVar('');
  this.answering.set(false);
});

Template.Mentor_MentorSpace_Page.helpers({
  answering() {
    return Template.instance().answering;
  },
  currentQuestion() {
    const questionID = Template.instance().answering.get();
    const question = MentorQuestions.findDoc(questionID);
    return question.title;
  },
  displayAnswering() {
    return Template.instance().answering.get();
  },
  questionsList() {
    return MentorQuestions.find({ visible: true });
  },
  mentorsList() {
    return Users.find({ roles: ['MENTOR'] });
  },
  mentorProfile(mentorID) {
    return MentorProfiles.getMentorProfile(mentorID);
  },
});

Template.Mentor_MentorSpace_Page.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
  this.$('.ui.dropdown').dropdown();
  this.answering.set(false);
});
