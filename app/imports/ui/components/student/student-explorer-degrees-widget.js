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
import { appLog } from '../../../api/log/AppLogCollection';
import { isInRole } from '../../utilities/template-helpers';

Template.Student_Explorer_Degrees_Widget.helpers({
  fullName(user) {
    if (getUserIdFromRoute() !== user._id) {
      return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
    }
    return '';
  },
  isInRole,
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    if (getUserIdFromRoute() !== user._id) {
      if (Users.findDoc(user).picture) {
        return Users.findDoc(user).picture;
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
  userStatus(degree) {
    let ret = true;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (user.academicPlanID) {
      const plan = AcademicPlans.findDoc(user.academicPlanID);
      if (_.includes(plan.degreeID, degree._id)) {
        ret = false;
      }
    }
    return ret;
  },
  userUsername(user) {
    if (getUserIdFromRoute() !== user._id) {
      return Users.findDoc(user).username;
    }
    return '';
  },
  plans() {
    const user = Users.findDoc({ username: getRouteUserName() });
    let semesterNumber;
    if (user.academicPlanID) {
      semesterNumber = AcademicPlans.findDoc(user.academicPlanID).semesterNumber;
    }
    const degree = DesiredDegrees.findDoc({ name: Template.instance().data.name });
    const plans = AcademicPlans.getPlansForDegree(degree._id, semesterNumber);
    return plans;
  },
  selectedPlan() {
    const user = Users.findDoc({ username: getRouteUserName() });
    if (user.academicPlanID) {
      return AcademicPlans.findDoc(user.academicPlanID).name;
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
        // eslint-disable-next-line
        const message = `${getRouteUserName()} updated their academic plan to ${AcademicPlans.toFullString(event.target.value)}`;
        appLog.info(message);
      }
    });
  },
});

Template.Student_Explorer_Degrees_Widget.onRendered(function studentExplorerDegressWidget() {
  this.$('.dropdown').dropdown();
});
