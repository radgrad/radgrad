import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { AdvisorLogs } from '/imports/api/log/AdvisorLogCollection';
import { sessionKeys } from '../../../startup/client/session-state';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Advisor_Log_Entry_Widget.helpers({
  advisorLogs() {
    if (Template.currentData().studentID.get()) {
      const studentID = Template.currentData().studentID.get();
      return AdvisorLogs.find({ studentID }, { sort: { createdOn: -1 } }).fetch();
    }
    return null;
  },
  advisorName(log) {
    return Users.findDoc(log.advisorID).firstName;
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
      AdvisorLogs.define({ advisor, student, text });
    }
  },
});

Template.Advisor_Log_Entry_Widget.onCreated(function advisorLogEntryOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(AdvisorLogs.getPublicationName());
});

Template.Advisor_Log_Entry_Widget.onRendered(function advisorLogEntryOnRendered() {
  // add your statement here
});

Template.Advisor_Log_Entry_Widget.onDestroyed(function advisorLogEntryOnDestroyed() {
  // add your statement here
});

