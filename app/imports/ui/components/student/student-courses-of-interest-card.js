import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';


Template.Student_Courses_Of_Interest_Card.onCreated(function appBodyOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Courses_Of_Interest_Card.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  courses() {
    return Courses.find().fetch();
  },
  courseInterests(course) {
    return Interests.findNames(course.interestIDs);
  },
  courseName(course) {
    return course.name;
  },
  courseSemesters() {
    // no semesters associated with courses
  },
  courseShortDescription(course) {
    let description = course.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}...`;
    }
    return description;
  },
  matchingInterests(course) {
    const matchingInterests = [];
    const user = Users.findDoc({ username: getRouteUserName() });
    const userInterests = [];
    const courseInterests = [];
    _.map(course.interestIDs, (id) => {
      courseInterests.push(Interests.findDoc(id));
    });
    _.map(user.interestIDs, (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.map(courseInterests, (courseInterest) => {
      _.map(userInterests, (userInterest) => {
        if (_.isEqual(courseInterest, userInterest)) {
          matchingInterests.push(userInterest);
        }
      });
    });
    return matchingInterests;
  },
  interestName(interest) {
    return interest.name;
  },
});

Template.Student_Courses_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    //to be implemented when semesters are associated with courses
  },
});

Template.Student_Courses_Of_Interest_Card.onRendered(function studentCoursesOfInterestCardOnRendered() {

});
