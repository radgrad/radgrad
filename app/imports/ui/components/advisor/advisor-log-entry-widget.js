import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { AdvisorLogs } from '/imports/api/log/AdvisorLogCollection';
import { sessionKeys } from '../../../startup/client/session-state';
import { moment } from 'meteor/momentjs:moment';

Template.Advisor_Log_Entry_Widget.helpers({
  logs() {
    const studentID = Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
    return AdvisorLogs.find({ studentID });
  },
  logDate(log) {
    const m = moment(log.createdOn);
    return m.format('MM/DD/YY');
  },
  logAdvisorName(log) {
    const advisor = AdvisorLogs.getAdvisorDoc(log.advisorID);
    return `${advisor.firstName} ${advisor.lastName}`;
  },
});

Template.Advisor_Log_Entry_Widget.events({
  'click .jsComment': function submit(event, instance) {
    event.preventDefault();
    const textAreas = event.target.parentElement.getElementsByTagName('textarea');
    if (textAreas.length > 0) {
      const text = textAreas[0].value;
      const studentID = instance.state.get(sessionKeys.CURRENT_STUDENT_ID);
      const advisorID = instance.state.get(sessionKeys.CURRENT_ADVISOR_ID);
      AdvisorLogs.define({ advisorID, studentID, text });
    }
  },
});

Template.Advisor_Log_Entry_Widget.onCreated(function advisorLogEntryOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  this.subscribe(AdvisorLogs.getPublicationName());
});

Template.Advisor_Log_Entry_Widget.onRendered(function advisorLogEntryOnRendered() {
  // add your statement here
});

Template.Advisor_Log_Entry_Widget.onDestroyed(function advisorLogEntryOnDestroyed() {
  // add your statement here
});

