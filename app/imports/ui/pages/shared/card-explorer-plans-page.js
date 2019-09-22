import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { getRouteUserName } from '../../components/shared/route-user-name';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Card_Explorer_Plans_Page.helpers({
  addedPlans() {
    const plan = [];
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const favorites = FavoriteAcademicPlans.find({ studentID }).fetch();
      return _.map(favorites, (f) => ({ item: AcademicPlans.findDoc(f.academicPlanID), count: 1 }));
    }
    return plan;
  },
  nonAddedPlans() {
    const plans = AcademicPlans.findNonRetired({});
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const favorites = _.map(FavoriteAcademicPlans.find({ studentID }).fetch(), (f) => f.academicPlanID);
      return _.filter(plans, p => _.includes(favorites, p._id));
    }
    // console.log('nonAddedPlans', plans);
    return plans;
  },
});
