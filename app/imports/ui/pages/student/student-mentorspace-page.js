import { Template } from 'meteor/templating';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_MentorSpace_Page.onCreated(function studentMentorSpacePageOnCreated() {
  this.subscribe(MentorQuestions.getPublicationName());
  this.subscribe(MentorAnswers.getPublicationName());
  this.subscribe(MentorProfiles.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_MentorSpace_Page.helpers({

  questionsList() {
    return MentorQuestions.getQuestions({ approved: true });
  },

  mentorsList() {
    return Users.find({ roles: ['MENTOR'] });
  },

  mentorProfile(mentorID) {
    return MentorProfiles.getMentorProfile(mentorID).fetch()[0];
  },
});

Template.Student_MentorSpace_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.

});

Template.Student_MentorSpace_Page.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });

  this.$('.ui.dropdown')
      .dropdown()
  ;

  this.$('.ui.rating')
      .rating()
  ;
});
