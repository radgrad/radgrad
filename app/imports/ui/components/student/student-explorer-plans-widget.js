import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
// import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
// import { updateAcademicPlanMethod } from '../../../api/user/UserCollection.methods';
// import { appLog } from '../../../api/log/AppLogCollection';
import { isInRole } from '../../utilities/template-helpers';

Template.Student_Explorer_Plans_Widget.onCreated(function studentExplorerPlansWidgetOnCreated() {
  // add your statement here
});

Template.Student_Explorer_Plans_Widget.helpers({
  fullName(user) {
    if (getUserIdFromRoute() !== user._id) {
      return Users.getFullName(user.username);
    }
    return '';
  },
  isInRole,
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    if (getUserIdFromRoute() !== user._id) {
      if (Users.getProfile(user).picture) {
        return Users.getProfile(user).picture;
      }
    }
    return '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else
      if (group === 'faculty') {
        return RouteNames.facultyExplorerUsersPageRouteName;
      }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
  userStatus(plan) {
    const profile = Users.getProfile(getRouteUserName());
    console.log(plan, profile);
    return profile.academicPlanID !== plan._id;
  },
  userUsername(user) {
    if (getUserIdFromRoute() !== user._id) {
      return Users.getProfile(user).username;
    }
    return '';
  },
  plans() {
    const profile = Users.getProfile(getRouteUserName());
    let semesterNumber;
    if (profile.academicPlanID) {
      semesterNumber = AcademicPlans.findDoc(profile.academicPlanID).semesterNumber;
    }
    const degree = DesiredDegrees.findDoc({ name: Template.instance().data.name });
    const plans = AcademicPlans.getPlansForDegree(degree._id, semesterNumber);
    return plans;
  },
  selectedPlan() {
    const profile = Users.getProfile(getRouteUserName());
    if (profile.academicPlanID) {
      return AcademicPlans.findDoc(profile.academicPlanID).name;
    }
    return '';
  },
});

Template.Student_Explorer_Plans_Widget.events({
  // add your events here
});

Template.Student_Explorer_Plans_Widget.onRendered(function studentExplorerPlansWidgetOnRendered() {
  // add your statement here
});

Template.Student_Explorer_Plans_Widget.onDestroyed(function studentExplorerPlansWidgetOnDestroyed() {
  // add your statement here
});

