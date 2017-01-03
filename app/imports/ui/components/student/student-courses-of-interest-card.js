import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';


Template.Student_Courses_Of_Interest_Card.onCreated(function studentCoursesOfInterestCardOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
});

function interestedStudentsHelper(course) {
  const interested = [];
  let count = 0;
  const ci = CourseInstances.find({
    courseID: course._id,
  }).fetch();
  _.map(ci, (c) => {
    if (count < 17) {
      if (!_.includes(interested, c.studentID)) {
        interested.push(c.studentID);
        count += 1;
      }
    } else if (count === 17) {
      interested.push('elipsis');
    }
  });
  return interested;
}

function currentSemester() {
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSem = Semesters.findDoc(currentSemesterID);
  return currentSem;
}

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
  interestedStudents(course) {
    return interestedStudentsHelper(course);
  },
  numberStudents(course) {
    return interestedStudentsHelper(course).length;
  },
  studentPicture(studentID) {
    if (studentID === 'elipsis') {
      return '/images/elipsis.png';
    }
    const student = Users.findDoc(studentID);
    return student.picture;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSem = currentSemester();
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
});

Template.Student_Courses_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const course = this.course;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: course.number,
      grade: '***',
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
  template.$('.chooseYear')
      .popup({
        on: 'click',
      });
});
