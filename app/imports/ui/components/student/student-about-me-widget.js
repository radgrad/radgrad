import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_About_Me_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentExplorerDegreesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
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
  desiredDegree() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      const degreeID = user.desiredDegreeID;
      return DesiredDegrees.findDoc(degreeID).name;
    }
    return '';
  },
  name() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  email() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return Users.getEmail(user._id);
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
  picture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
    }
    return '';
  },
  interests() {
    let ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      ret = user.interestIDs;
    }
    return ret;
  },
  interestName(interest) {
    return Interests.findDoc(interest).name;
  },
  goalName(goal) {
    return goal.name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
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
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
});


Template.Student_About_Me_Widget.onRendered(function studentAboutMeOnRendered() {
  // add your statement here
});

Template.Student_About_Me_Widget.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

