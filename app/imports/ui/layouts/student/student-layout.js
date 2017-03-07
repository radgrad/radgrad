import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';

Template.Student_Layout.onCreated(function studentLayoutOnCreated() {
  this.subscribe(Users.getPublicationName());
});

function getStudentDoc() {
  const username = getRouteUserName();
  return Users.getUserFromUsername(username);
}

Template.Student_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.studentHomePageRouteName, regex: 'home' },
      { label: 'Degree Planner', route: RouteNames.studentDegreePlannerPageRouteName, regex: 'degree-planner' },
      { label: 'Explorer', route: RouteNames.studentExplorerPageRouteName, regex: 'explorer' },
      { label: 'Mentor Space', route: RouteNames.studentMentorSpacePageRouteName, regex: 'mentor-space' },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
  earnedICE() {
    return Users.getEarnedICE(getStudentDoc()._id);
  },
  projectedICE() {
    return Users.getProjectedICE(getStudentDoc()._id);
  },
  level() {
    return getStudentDoc().level ? getStudentDoc().level : '0';
  },
});
