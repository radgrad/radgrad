import { ReactiveDict } from 'meteor/reactive-dict';

export const sessionKeys = {
  CURRENT_ROLE: 'currentRole',
  CURRENT_ADMIN_ID: 'currentAdminID',
  CURRENT_ADVISOR_ID: 'currentAdvisorID',
  CURRENT_FACULTY_ID: 'currentFacultyID',
  CURRENT_STUDENT_ID: 'currentStudentID',
  CURRENT_UH_ID: 'currentUhID',
};

export const SessionState = new ReactiveDict();
