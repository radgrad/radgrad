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
  courseSemesters(course) {
    const semesters = course.semesterIDs;
    let semesterNames = [];
    _.map(semesters, (sem) => {
      semesterNames.push(Semesters.toString(sem));
    });
    return semesterNames;
  },
  courseShortDescription(descript) {
    let description = descript;
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
  'click .addToPlan': function clickItemAddToPlan(event, instance) {
    event.preventDefault();
    const course = this.course;
    const name = course.name;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID)).username;
    const ci = {
      semester: semSlug,
      opportunity: courseSlug.name,
      verified: false,
      student: username,
    };
    CourseInstances.define(ci);
  },
});

Template.Student_Courses_Of_Interest_Card.onRendered(function studentCoursesOfInterestCardOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
