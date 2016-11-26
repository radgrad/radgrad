import { Template } from 'meteor/templating';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';

Template.Session_State_Segment.helpers({
  currentRole() {
    return SessionState.get(sessionKeys.CURRENT_ROLE);
  },
  adminID() {
    return SessionState.get(sessionKeys.CURRENT_ADMIN_ID);
  },
  advisorID() {
    return SessionState.get(sessionKeys.CURRENT_ADVISOR_ID);
  },
  facultyID() {
    return SessionState.get(sessionKeys.CURRENT_FACULTY_ID);
  },
  studentID() {
    return SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
  },
  uhID() {
    return SessionState.get(sessionKeys.CURRENT_UH_ID);
  },
});

Template.Session_State_Segment.events({
  // add your events here
});

Template.Session_State_Segment.onCreated(function sessionStateSegmentOnCreated() {
  // eslint-disable-next-line no-undef
  if (sessionStorage.CURRENT_ROLE && !SessionState.get(sessionKeys.CURRENT_ROLE)) {
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_ROLE, sessionStorage.CURRENT_ROLE);
  }
  // eslint-disable-next-line no-undef
  if (sessionStorage.CURRENT_ADMIN_ID && !SessionState.get(sessionKeys.CURRENT_ADMIN_ID)) {
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_ADMIN_ID, sessionStorage.CURRENT_ADMIN_ID);
  }
  // eslint-disable-next-line no-undef
  if (sessionStorage.CURRENT_ADVISOR_ID && !SessionState.get(sessionKeys.CURRENT_ADVISOR_ID)) {
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, sessionStorage.CURRENT_ADVISOR_ID);
  }
  // eslint-disable-next-line no-undef
  if (sessionStorage.CURRENT_FACULTY_ID && !SessionState.get(sessionKeys.CURRENT_FACULTY_ID)) {
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_FACULTY_ID, sessionStorage.CURRENT_FACULTY_ID);
  }
  // eslint-disable-next-line no-undef
  if (sessionStorage.CURRENT_STUDENT_ID && !SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_STUDENT_ID, sessionStorage.CURRENT_STUDENT_ID);
  }
});

Template.Session_State_Segment.onRendered(function sessionStateSegmentOnRendered() {
  // add your statement here
});

Template.Session_State_Segment.onDestroyed(function sessionStateSegmentOnDestroyed() {
  // add your statement here
});

