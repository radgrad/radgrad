import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Student_Card_Explorer_Plans_Page.onCreated(function studentcardexplorerplanspageOnCreated() {
  // add your statement here
});

Template.Student_Card_Explorer_Plans_Page.helpers({
  addedPlans() {
    const plan = [];
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const thePlan = AcademicPlans.findOne({ _id: profile.academicPlanID });
      if (thePlan) {
        plan.push(thePlan);
      }
    }
    return plan;
  },
  nonAddedPlans() {
    const plans = AcademicPlans.find({}).fetch();
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return _.filter()
    }
    return plans;
  },
});

Template.Student_Card_Explorer_Plans_Page.events({
  // add your events here
});

Template.Student_Card_Explorer_Plans_Page.onRendered(function studentcardexplorerplanspageOnRendered() {
  // add your statement here
});

Template.Student_Card_Explorer_Plans_Page.onDestroyed(function studentcardexplorerplanspageOnDestroyed() {
  // add your statement here
});

