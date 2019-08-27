import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { getRouteUserName } from './route-user-name';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { getUserIdFromRoute } from './get-user-id-from-route';

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
      })
        .fetch(), (ap) => !ap.retired);
      if (plans.length === 0) {
        plans = AcademicPlans.getLatestPlans();
      }
    }
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
    const favoriteIDs = _.map(favorites, (f) => f.academicPlanID);
    plans = _.filter(plans, (p) => !_.includes(favoriteIDs, p._id));
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
      const studentID = getUserIdFromRoute();
      const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
      return favorites.length === 0;
    }
    return false;
  },
  plans() {
    return availableAcademicPlans();
  },
});
