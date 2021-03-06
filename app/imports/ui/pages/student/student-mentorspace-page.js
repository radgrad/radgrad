import { Template } from 'meteor/templating';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_MentorSpace_Page.helpers({
  questionsList() {
    return MentorQuestions.find({ visible: true });
  },
  mentorsList() {
    return Users.findProfilesWithRole(ROLE.MENTOR);
  },
  mentorProfile(mentorID) {
    return MentorProfiles.getProfile(mentorID);
  },
  submittedQuestions() {
    return MentorQuestions.find({ studentID: getUserIdFromRoute(), visible: false }).fetch();
  },
});
