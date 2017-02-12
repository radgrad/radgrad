import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';

import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';

Template.Landing_Section_1.onCreated(function landingSection1OnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Landing_Section_1.helpers({
  coursesCount() {
    return Math.floor(Courses.find().count());
  },
  interestsCount() {
    return Interests.find().count();
  },
  studentHomePageRouteName() {
    return RouteNames.studentHomePageRouteName;
  },
  checkLanding() {
    const routeName = FlowRouter.current().route.name;
    if (routeName === 'Landing_Page') {
      return true;
    }
    return false;
  },
  useCAS() {
    return false;
  },
  josephineICE() {
    return { i: 100, c: 100, e: 100 };
  },
  brianICE() {
    return { i: 100, c: 95, e: 99 };
  },
  micheleICE() {
    return { i: 98, c: 100, e: 94 };
  },
  aljonICE() {
    return { i: 100, c: 99, e: 99 };
  },
  kelsieICE() {
    return { i: 96, c: 100, e: 100 };
  },
  syICE() {
    return { i: 95, c: 97, e: 100 };
  },
});

Template.Landing_Section_1.events({
  // add your events here
});

Template.Landing_Section_1.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Section_1.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_1.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});

