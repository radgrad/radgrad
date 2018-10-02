import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { updateAcademicPlanMethod } from '../../../api/user/UserCollection.methods';
import { isInRole } from '../../utilities/template-helpers';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

Template.Student_Explorer_Degrees_Widget.helpers({
  fullName(user) {
    if (getUserIdFromRoute() !== user._id) {
      return Users.getFullName();
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
    return defaultProfilePicture;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
      if (group === 'faculty') {
        return RouteNames.facultyCardExplorerUsersPageRouteName;
      }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userStatus(degree) {
    let ret = true;
    const profile = Users.getProfile(getRouteUserName());
    if (profile.academicPlanID) {
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      if (_.includes(plan.degreeID, degree._id)) {
        ret = false;
      }
    }
    return ret;
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

Template.Student_Explorer_Degrees_Widget.events({
  'change [name=academicPlan]': function changePlan(event) {
    event.preventDefault();
    updateAcademicPlanMethod.call(event.target.value, (error) => {
      if (error) {
        console.log('Error updating student\'s academic plan', error);
      } else {
        FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
      }
    });
  },
});

Template.Student_Explorer_Degrees_Widget.onRendered(function studentExplorerDegressWidget() {
  this.$('.dropdown').dropdown();
});
