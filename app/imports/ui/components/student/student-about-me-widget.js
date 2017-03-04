import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_About_Me_Widget.helpers({
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentExplorerDegreesPageRouteName;
  },
  desiredDegree() {
    let ret = '';
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      if (user.desiredDegreeID) {
        ret = DesiredDegrees.findDoc(user.desiredDegreeID).name;
      }
    }
    return ret;
  },
  email() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return Users.getEmail(user._id);
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
    const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
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
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  name() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
    }
    return '';
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
    }
    return '';
  },
  website() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.website;
    }
    return '';
  },
});

Template.Student_About_Me_Widget.events({
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const user = Users.findDoc({ username: getRouteUserName() });
    const choice = event.target.website.value;
    Users.setWebsite(user._id, choice);
  },
  'submit .picture': function submitPicture(event) {
    event.preventDefault();
    const user = Users.findDoc({ username: getRouteUserName() });
    const choice = event.target.picture.value;
    Users.setPicture(user._id, choice);
  },
  'click .picture': function clickPicture(event) {
    event.preventDefault();
  },
});

Template.Student_About_Me_Widget.onCreated(function studentAboutMeWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(5), getUserIdFromRoute());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
});


Template.Student_About_Me_Widget.onRendered(function studentAboutMeOnRendered() {
  // add your statement here
});

Template.Student_About_Me_Widget.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

