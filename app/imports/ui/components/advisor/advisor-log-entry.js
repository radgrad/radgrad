import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';

Template.Advisor_Log_Entry.helpers({
  // add you helpers here
});

Template.Advisor_Log_Entry.events({
  'click .jsComment': function submit(event) {
    event.preventDefault();
    const textAreas = event.target.parentElement.getElementsByTagName('textarea');
    if (textAreas.length > 0) {
      const text = textAreas[0].value;
      const studentID = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
      const advisorID = SessionState.get(sessionKeys.CURRENT_ADVISOR_ID);
      Meteor.call('Collection.define', {
        collectionName: 'AdvisorLogs',
        doc: { advisorID, studentID, text },
      });
    }
  },
});

Template.Advisor_Log_Entry.onCreated(function advisorLogEntryOnCreated() {
  updateSessionState();
});

Template.Advisor_Log_Entry.onRendered(function advisorLogEntryOnRendered() {
  // add your statement here
});

Template.Advisor_Log_Entry.onDestroyed(function advisorLogEntryOnDestroyed() {
  // add your statement here
});

