import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { getRouteUserName } from './route-user-name';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

function availableAcademicPlans() {
  let plans = AcademicPlans.findNonRetired({}, { sort: { year: 1, name: 1 } });
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    if (!profile.declaredSemesterID) {
      plans = AcademicPlans.getLatestPlans();
    } else {
      const declaredSemester = Semesters.findDoc(profile.declaredSemesterID);
      plans = _.filter(AcademicPlans.find({ semesterNumber: { $gte: declaredSemester.semesterNumber } }, {
        sort: {
          year: 1,
          name: 1,
        },
      }).fetch(), (ap) => !ap.retired);
    }
    if (profile.academicPlanID) {
      return _.filter(plans, p => profile.academicPlanID !== p._id);
    }
  }
  return plans;
}

Template.Card_Explorer_Plans_Widget.helpers({
  canAdd() {
    const group = FlowRouter.current().route.group.name;
    return group === 'student';
  },
  itemCount() {
    return availableAcademicPlans().length;
  },
  noPlan() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      if (getRouteUserName()) {
        return _.isNil(Users.getProfile(getRouteUserName()).academicPlanID);
      }
    }
    return false;
  },
  plans() {
    return availableAcademicPlans();
  },
});
