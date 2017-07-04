import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { updateAcademicPlanMethod } from '../../../api/user/UserCollection.methods';

Template.Student_Explorer_Degrees_Widget.helpers({
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  isInRole(role) {
    const group = FlowRouter.current().route.group.name;
    return group === role;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
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
    return Users.findDoc(user).username;
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
      }
    });
  },
});

Template.Student_Explorer_Degrees_Widget.onRendered(function studentExplorerDegressWidget() {
  this.$('.dropdown').dropdown();
});
