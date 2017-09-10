import { Template } from 'meteor/templating';
import { AppLogs } from '../../../api/log/AppLogCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Event_Log_Widget.onCreated(function onCreated() {
  this.subscribe(AppLogs.getPublicationName());
});

Template.Event_Log_Widget.helpers({
  logs() {
    const windowMilliSeconds = 1000 * 60 * 60 * 24; // One day.
    return AppLogs.find({ date: { $gt: new Date(Date.now() - windowMilliSeconds) } }, { sort: { timestamp: -1 } });
  },
  user(userID) {
    return (Users.isDefined(userID)) ? Users.getFullName(userID) : '?';
  },
  additional(additionalEntry) {
    return JSON.stringify(additionalEntry, ' ');
  },
  timestamp(timestampEntry) {
    return new Date(timestampEntry);
  },
});
