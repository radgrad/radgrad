import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Card_Explorer_Plans_Page.helpers({
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
      return _.filter(plans, p => profile.academicPlanID === p._id);
    }
    return plans;
  },
});
