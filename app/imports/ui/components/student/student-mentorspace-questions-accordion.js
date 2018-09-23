import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

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

Template.Student_MentorSpace_Questions_Accordion.onRendered(function studentMentorSpaceQuestionsAccordionOnRendered() {
  this.$('.ui.accordion').accordion();
});
