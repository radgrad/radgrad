import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_About_Me_Widget.helpers({
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      _.forEach(profile.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  careerGoalsRouteName() {
    return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentCardExplorerPlansPageRouteName;
  },
  desiredDegrees() {
    const ret = [];
    if (getUserIdFromRoute()) {
      const studentID = getUserIdFromRoute();
      const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
      _.forEach(favorites, (f) => {
        ret.push(AcademicPlans.findDoc(f.academicPlanID));
      });
    }
    return ret;
  },
  email() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.username;
    }
    return '';
  },
  firstCareerGoal() {
    let ret;
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      ret = Slugs.findDoc(careerGoals[0].slugID).name;
    }
    return ret;
  },
  firstDegree() {
    let ret;
    const degrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
    }
    return ret;
  },
  firstInterest() {
    let ret;
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  },
  getDictionary() {
    return Template.instance().state;
  },
  goalName(goal) {
    return goal.name;
  },
  interestName(interest) {
    return interest.name;
  },
  interests() {
    const ret = [];
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      _.forEach(profile.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  interestsRouteName() {
    return RouteNames.studentCardExplorerInterestsPageRouteName;
  },
  name() {
    if (getRouteUserName()) {
      return Users.getFullName(getRouteUserName());
    }
    return '';
  },
  picture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.picture;
    }
    return '';
  },
  planName(plan) {
    return plan.name;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.picture;
    }
    return '';
  },
  website() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.website;
    }
    return '';
  },
});

Template.Student_About_Me_Widget.events({
});
