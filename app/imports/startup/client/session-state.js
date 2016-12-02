import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Roles } from 'meteor/alanning:roles';

import { AdminChoices } from '../../api/admin/AdminChoiceCollection';
import { AdvisorChoices } from '../../api/advisor/AdvisorChoiceCollection';
import { ROLE } from '../../api/role/Role';

export const sessionKeys = {
  CURRENT_ROLE: 'currentRole',
  CURRENT_ADMIN_ID: 'currentAdminID',
  CURRENT_ADVISOR_ID: 'currentAdvisorID',
  CURRENT_FACULTY_ID: 'currentFacultyID',
  CURRENT_MENTOR_ID: 'currentMentorID',
  CURRENT_STUDENT_ID: 'currentStudentID',
  CURRENT_STUDENT_USERNAME: 'studentUsername',
};

export const SessionState = new ReactiveDict();

export const updateSessionState = () => {
  if (!SessionState.get(sessionKeys.CURRENT_ROLE)) {
    const userID = Meteor.userId();
    if (Roles.userIsInRole(userID, ROLE.ADMIN)) {
      if (AdminChoices.find({ adminID: userID }).count() === 1) {
        const adminChoice = AdminChoices.find({ adminID: userID }).fetch()[0];
        SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.ADMIN);
        SessionState.set(sessionKeys.CURRENT_ADMIN_ID, adminChoice.adminID);
        SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, adminChoice.advisorID);
        SessionState.set(sessionKeys.CURRENT_FACULTY_ID, adminChoice.facultyID);
        SessionState.set(sessionKeys.CURRENT_MENTOR_ID, adminChoice.mentorID);
        SessionState.set(sessionKeys.CURRENT_STUDENT_ID, adminChoice.studentID);
        SessionState.set(sessionKeys.CURRENT_STUDENT_USERNAME, adminChoice.username);
      }
    } else if (Roles.userIsInRole(userID, ROLE.ADVISOR)) {
      if (AdvisorChoices.find({ advisorID: userID }).count() === 1) {
        const advisorChoice = AdvisorChoices.find({ advisorID: userID }).fetch()[0];
        SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.ADVISOR);
        SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, advisorChoice.advisorID);
        SessionState.set(sessionKeys.CURRENT_STUDENT_ID, advisorChoice.studentID);
      }
    } else if (Roles.userIsInRole(userID, ROLE.FACULTY)) {
      SessionState.set(sessionKeys.CURRENT_FACULTY_ID, userID);
    } else if (Roles.userIsInRole(userID, ROLE.MENTOR)) {
      SessionState.set(sessionKeys.CURRENT_MENTOR_ID, userID);
    } else if (Roles.userIsInRole(userID, ROLE.STUDENT)) {
      SessionState.set(sessionKeys.CURRENT_STUDENT_ID, userID);
    }
  }
};
