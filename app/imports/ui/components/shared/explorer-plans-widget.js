import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { getRouteUserName } from './route-user-name';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { isInRole } from '../../utilities/template-helpers';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getGroupName } from './route-group-name';

Template.Explorer_Plans_Widget.onCreated(function studentExplorerPlansWidgetOnCreated() {
  this.planVar = new ReactiveVar();
});

Template.Explorer_Plans_Widget.helpers({
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
    return defaultProfilePicture;
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userStatus(plan) {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const plans = _.map(FavoriteAcademicPlans.find({ studentID: profile.userID }).fetch(),
        (p) => AcademicPlans.findDoc(p.academicPlanID)._id);
      return _.includes(plans, plan._id);
    }
    return false;
  },
  userUsername(user) {
    if (getUserIdFromRoute() !== user._id) {
      return Users.getProfile(user).username;
    }
    return '';
  },
  plans() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      let semesterNumber;
      if (profile.academicPlanID) {
        semesterNumber = AcademicPlans.findDoc(profile.academicPlanID).semesterNumber;
      }
      const degree = DesiredDegrees.findDoc({ name: Template.instance().data.name });
      const plans = AcademicPlans.getPlansForDegree(degree._id, semesterNumber);
      return plans;
    }
    return [];
  },
  planVar() {
    return Template.instance().planVar;
  },
  plan() {
    return Template.instance().data.item;
  },
  selectedPlan() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (profile.academicPlanID) {
        return AcademicPlans.findDoc(profile.academicPlanID).name;
      }
    }
    return '';
  },
});

Template.Explorer_Plans_Widget.events({
  'click .addItem': function selectAcademicPlan(event, instance) {
    event.preventDefault();
    const collectionName = FavoriteAcademicPlans.getCollectionName();
    const doc = AcademicPlans.findDoc(instance.data.id);
    const definitionData = {};
    definitionData.student = getRouteUserName();
    definitionData.academicPlan = Slugs.getNameFromID(doc.slugID);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define favorite', error);
      }
    });
  },
  'click .deleteItem': function deleteAcademicPlan(event, instance) {
    event.preventDefault();
    const collectionName = FavoriteAcademicPlans.getCollectionName();
    const favorite = FavoriteAcademicPlans.findDoc({ academicPlanID: instance.data.id });
    removeItMethod.call({ collectionName, instance: favorite._id }, (error) => {
      if (error) {
        console.error('Failed to remove favorite', error);
      }
    });
  },
});

Template.Explorer_Plans_Widget.onRendered(function studentExplorerPlansWidgetOnRendered() {
  Template.instance()
    .planVar
    .set(Template.instance().data.item);
});
