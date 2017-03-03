import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Users } from '../../../api/user/UserCollection.js';
import {  } from '../../components/shared/route-user-name.js';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Log_Widget.helpers({
  advisorImage(log){
    return Users.findDoc(log.advisorID).picture;
  },
  advisorName(log){
    return Users.findDoc(log.advisorID).firstName;
  },
  displayDate(log) {
    const date = log.createdOn;
    return `${date.toDateString()}  ${date.getHours()}:${date.getMinutes()}`;
  },
  logs() {
    return AdvisorLogs.find({ studentID: getUserIdFromRoute() }, { sort: { createdOn: -1 } });
  },
});

Template.Student_Log_Widget.onCreated(function studentLogWidgetOnCreated() {
  this.subscribe(Users.getPublicationName());
  this.subscribe(AdvisorLogs.getPublicationName());
});
