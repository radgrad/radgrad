import { Template } from 'meteor/templating';

import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';

Template.Landing_Section_2.onCreated(function landingSection2OnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
});

Template.Landing_Section_2.helpers({
  coursesCount() {
    const courseCount = Courses.find().count();
    // const lastDigit = courseCount % 10;
    // return courseCount - lastDigit;
    return courseCount;
  },
  interestsCount() {
    const interestCount = Interests.find().count();
    // const lastDigit = interestCount % 10;
    // return interestCount - lastDigit;
    return interestCount;
  },
  opportunitiesCount() {
    const opportunityCount = Opportunities.find().count();
    // const lastDigit = opportunityCount % 10;
    // return opportunityCount - lastDigit;
    return opportunityCount;
  },
  careerGoalsCount() {
    const count = CareerGoals.find().count();
    return count;
  },
});

Template.Landing_Section_2.events({
  // add your events here
});

Template.Landing_Section_2.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Section_2.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_2.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});

