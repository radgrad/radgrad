import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { ROLE } from '../../../api/role/Role';
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
  mentorID() {
    return SessionState.get(sessionKeys.CURRENT_MENTOR_ID);
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
  const adminID = Meteor.userId();
  if (AdminChoices.find().count() === 0) {
    AdminChoices.define({ adminID });
  }
  const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
  if (!SessionState.get(sessionKeys.CURRENT_ROLE)) {
    SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.ADMIN);
  }
  if (!SessionState.get(sessionKeys.CURRENT_ADMIN_ID)) {
    SessionState.set(sessionKeys.CURRENT_ADMIN_ID, adminID);
  }
  if (!SessionState.get(sessionKeys.CURRENT_ADVISOR_ID)) {
    SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, adminChoice.advisorID);
  }
  if (!SessionState.get(sessionKeys.CURRENT_FACULTY_ID)) {
    SessionState.set(sessionKeys.CURRENT_FACULTY_ID, adminChoice.facultyID);
  }
  if (!SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
    SessionState.set(sessionKeys.CURRENT_STUDENT_ID, adminChoice.studentID);
  }
  if (!SessionState.get(sessionKeys.CURRENT_MENTOR_ID)) {
    SessionState.set(sessionKeys.CURRENT_MENTOR_ID, adminChoice.mentorID);
  }
});

Template.Session_State_Segment.onRendered(function sessionStateSegmentOnRendered() {
  // add your statement here
});

Template.Session_State_Segment.onDestroyed(function sessionStateSegmentOnDestroyed() {
  // add your statement here
});

