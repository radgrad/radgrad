import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { AdvisorLogs } from '/imports/api/log/AdvisorLogCollection';
import { sessionKeys } from '../../../startup/client/session-state';

Template.Advisor_Log_Entry.helpers({
  // add you helpers here
});

Template.Advisor_Log_Entry.events({
  'click .jsComment': function submit(event, instance) {
    event.preventDefault();
    const textAreas = event.target.parentElement.getElementsByTagName('textarea');
    if (textAreas.length > 0) {
      const text = textAreas[0].value;
      const studentID = instance.state.get(sessionKeys.CURRENT_STUDENT_ID);
      const advisorID = instance.state.get(sessionKeys.CURRENT_ADVISOR_ID);
      console.log(studentID, advisorID, text);
      AdvisorLogs.define({ advisorID, studentID, text });
    }
  },
});

Template.Advisor_Log_Entry.onCreated(function advisorLogEntryOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
});

Template.Advisor_Log_Entry.onRendered(function advisorLogEntryOnRendered() {
  // add your statement here
});

Template.Advisor_Log_Entry.onDestroyed(function advisorLogEntryOnDestroyed() {
  // add your statement here
});

