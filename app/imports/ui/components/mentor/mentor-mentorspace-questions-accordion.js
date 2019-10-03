import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';
import * as RouteNames from '../../../startup/client/router.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';


Template.Mentor_MentorSpace_Questions_Accordion.onCreated(function studentMentorSpaceQuestionsAccordionOnCreated() {
  this.answering = new ReactiveVar(false);
});

Template.Mentor_MentorSpace_Questions_Accordion.helpers({
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
    if (getUserIdFromRoute()) {
      return Roles.userIsInRole(getUserIdFromRoute(), [ROLE.MENTOR]);
    }
    return false;
  },
  listAnswers(questionID) {
    return MentorAnswers.getAnswers(questionID);
  },
  mentorName(mentorID) {
    return Users.getFullName(mentorID);
  },
  picture(mentorID) {
    return Users.getProfile(mentorID).picture;
  },
  usersRouteName() {
    return RouteNames.studentCardExplorerUsersPageRouteName;
  },
  userUsername(mentorID) {
    return Users.getProfile(mentorID).username;
  },
});


Template.Mentor_MentorSpace_Questions_Accordion.events({
  'click .answer': function clickAnswer(event, instance) {
    const questionID = event.target.id;
    instance.answering.set(questionID);
  },
});

Template.Mentor_MentorSpace_Questions_Accordion.onRendered(function studentMentorSpaceQuestionsAccordionOnRendered() {
  this.$('.ui.accordion').accordion();
});
