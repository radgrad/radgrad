import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

function getStudentDoc() {
  return Users.getProfile(getRouteUserName());
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
    if (getRouteUserName()) {
      return StudentProfiles.getEarnedICE(getStudentDoc().userID);
    }
    return null;
  },
  projectedICE() {
    if (getRouteUserName()) {
      return StudentProfiles.getProjectedICE(getStudentDoc().userID);
    }
    return null;
  },
  level() {
    if (getRouteUserName()) {
      return getStudentDoc().level ? getStudentDoc().level : '0';
    }
    return null;
  },
});
