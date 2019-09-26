import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_About_Me_Widget.onCreated(function studentAboutMeWidgetOnCreated() {
  this.data.student = Users.getProfile(getRouteUserName());
  this.data.name = Users.getFullName(getRouteUserName());
  // console.log('Student_About_Me_Widget', this.data);
});

Template.Student_About_Me_Widget.helpers({
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const student = Template.instance().data.student;
      _.forEach(student.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  careerGoalRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
  },
  academicPlanRouteName() {
    return RouteNames.studentExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    return RouteNames.studentCardExplorerPlansPageRouteName;
  },
  favoriteAcademicPlans() {
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
      return Template.instance().data.student.username;
    }
    return '';
  },
  interests() {
    const ret = [];
    if (getRouteUserName()) {
      const student = Template.instance().data.student;
      _.forEach(student.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  interestRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentCardExplorerInterestsPageRouteName;
  },
  name() {
    if (getRouteUserName()) {
      return Template.instance().data.name;
    }
    return '';
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
});

Template.Student_About_Me_Widget.events({
});
