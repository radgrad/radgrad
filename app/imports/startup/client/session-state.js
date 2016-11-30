import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { AdminChoices } from '../../api/admin/AdminChoiceCollection';
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

export const updateSessionState = (state) => {
  if (!state.get(sessionKeys.CURRENT_ROLE)) {
    const adminID = Meteor.userId();
    if (AdminChoices.find({ adminID }).count() === 1) {
      const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
      state.set(sessionKeys.CURRENT_ROLE, ROLE.ADMIN);
      state.set(sessionKeys.CURRENT_ADMIN_ID, adminChoice.adminID);
      state.set(sessionKeys.CURRENT_ADVISOR_ID, adminChoice.advisorID);
      state.set(sessionKeys.CURRENT_FACULTY_ID, adminChoice.facultyID);
      state.set(sessionKeys.CURRENT_MENTOR_ID, adminChoice.mentorID);
      state.set(sessionKeys.CURRENT_STUDENT_ID, adminChoice.studentID);
      state.set(sessionKeys.CURRENT_STUDENT_USERNAME, adminChoice.username);
    }
  }
};

export const SessionState = new ReactiveDict();
