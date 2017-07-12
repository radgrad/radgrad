import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
// import { updateAcademicPlanMethod } from '../../../api/user/UserCollection.methods';
import { appLog } from '../../../api/log/AppLogCollection';
import { isInRole } from '../../utilities/template-helpers';

Template.Student_Explorer_Plans_Widget.onCreated(function studentExplorerPlansWidgetOnCreated() {
  this.planVar = new ReactiveVar();
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
  planVar() {
    return Template.instance().planVar;
  },
  plan() {
    return Template.instance().data.item;
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
  'click .addItem': function selectAcademicPlan(event, instance) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const updateData = {};
    const collectionName = StudentProfiles.getCollectionName();
    updateData.id = profile._id;
    updateData.academicPlan = instance.data.id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        appLog.error(`Error updating ${getRouteUserName()}'s academic plan ${JSON.stringify(error)}`);
      } else {
        appLog.info(`Updated ${getRouteUserName()}'s academic plan to ${instance.data.slug}`);
      }
    });
  },
});

Template.Student_Explorer_Plans_Widget.onRendered(function studentExplorerPlansWidgetOnRendered() {
  Template.instance().planVar.set(Template.instance().data.item);
});

Template.Student_Explorer_Plans_Widget.onDestroyed(function studentExplorerPlansWidgetOnDestroyed() {
  // add your statement here
});

