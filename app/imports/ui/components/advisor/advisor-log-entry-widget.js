import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { advisorLogsDefineMethod } from '../../../api/log/AdvisorLogCollection.methods';
import { sessionKeys } from '../../../startup/client/session-state';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Users } from '../../../api/user/UserCollection.js';

Template.Advisor_Log_Entry_Widget.helpers({
  advisorLogs() {
    if (Template.currentData().studentID.get()) {
      const studentID = Template.currentData().studentID.get();
      return AdvisorLogs.findNonRetired({ studentID }, { sort: { createdOn: -1 } });
    }
    return null;
  },
  advisorName(log) {
    return Users.getProfile(log.advisorID).firstName;
  },
  displayDate(log) {
    const date = log.createdOn;
    return `${date.toDateString()}  ${date.getHours()}:${date.getMinutes()}`;
  },
});

Template.Advisor_Log_Entry_Widget.events({
  'click .jsComment': function submit(event, instance) {
    event.preventDefault();
    const textAreas = event.target.parentElement.getElementsByTagName('textarea');
    if (textAreas.length > 0) {
      const text = textAreas[0].value;
      const student = instance.state.get(sessionKeys.CURRENT_STUDENT_ID);
      const advisor = getUserIdFromRoute();
      advisorLogsDefineMethod.call({ advisor, student, text }, (error) => {
        if (error) {
          console.log('Error creating AdvisorLog.', error);
        }
      });
    }
  },
});

Template.Advisor_Log_Entry_Widget.onCreated(function advisorLogEntryOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
});
