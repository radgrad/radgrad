import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import * as RouteNames from '../../../startup/client/router.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_MentorSpace_Questions_Accordion.onCreated(function studentMentorSpaceQuestionsAccordionOnCreated() {
  if (this.data.answering) {
    this.answering = this.data.answering;
  }
});

Template.Student_MentorSpace_Questions_Accordion.onRendered(function studentMentorSpaceQuestionsAccordionOnRendered() {
  this.$('.ui.accordion').accordion({ exclusive: false, active: false });
});

Template.Student_MentorSpace_Questions_Accordion.helpers({
  answerCount(questionID) {
    return MentorAnswers.getAnswers(questionID).count();
  },
  answered(questionID) {
    return ((MentorAnswers.find({ questionID, mentorID: getUserIdFromRoute() }).fetch()).length !== 0);
  },
  isOneAnswer(questionID) {
    return MentorAnswers.getAnswers(questionID).count() === 1;
  },
  isMentor() {
    return Roles.userIsInRole(getUserIdFromRoute(), [ROLE.MENTOR]);
  },
  listAnswers(questionID) {
    return MentorAnswers.getAnswers(questionID);
  },
  mentorName(mentorID) {
    const firstName = Users.findDoc({ _id: mentorID }).firstName;
    const lastName = Users.findDoc({ _id: mentorID }).lastName;
    return `${firstName}  ${lastName}`;
  },
  picture(mentorID) {
    return Users.findDoc({ _id: mentorID }).picture;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userUsername(mentorID) {
    return Users.findDoc({ _id: mentorID }).username;
  },
});


Template.Student_MentorSpace_Questions_Accordion.events({
  'click .answer': function clickAnswer(event, instance) {
    const questionID = event.target.id;
    instance.answering.set(questionID);
  },
});
