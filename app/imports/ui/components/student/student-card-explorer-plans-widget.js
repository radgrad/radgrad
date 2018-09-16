import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';

function availableAcademicPlans() {
  let plans = AcademicPlans.find({}, { sort: { year: 1, name: 1 } }).fetch();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    if (!profile.declaredSemesterID) {
      plans = AcademicPlans.getLatestPlans();
    }
    if (profile.academicPlanID) {
      return _.filter(plans, p => profile.academicPlanID !== p._id);
    }
  }
  return plans;
}
Template.Student_Card_Explorer_Plans_Widget.helpers({
  itemCount() {
    return availableAcademicPlans().length;
  },
  noPlan() {
    if (getRouteUserName()) {
      return _.isNil(Users.getProfile(getRouteUserName()).academicPlanID);
    }
    return true;
  },
  plans() {
    return availableAcademicPlans();
  },
});
