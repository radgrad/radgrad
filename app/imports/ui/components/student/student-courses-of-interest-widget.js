import { Template } from 'meteor/templating';
import { _, lodash } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Courses_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

function passedCourse(course) {
  let ret = false;
  if (course.grade === 'A+' || course.grade === 'A' || course.grade === 'A-' ||
      course.grade === 'B+' || course.grade === 'B' || course.grade === 'B-' ||
      course.grade === 'CR') {
    ret = true;
  }
  return ret;
}

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0) {
    const filtered = lodash.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const passedCourses = [];
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
      _.map(ci, (c) => {
        if (passedCourse(c)) {
          passedCourses.push(c);
        }
      });
      return passedCourses.length === 0;
    });
    return filtered;
  }
  return [];
};

function matchingCourses() {
  const allCourses = availableCourses();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let courseInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allCourses, (course) => {
    courseInterests = [];
    _.map(course.interestIDs, (id) => {
      courseInterests.push(Interests.findDoc(id));
      _.map(courseInterests, (courseInterest) => {
        _.map(userInterests, (userInterest) => {
          if (_.isEqual(courseInterest, userInterest)) {
            if (!_.includes(matching, course)) {
              matching.push(course);
            }
          }
        });
      });
    });
  });
  return matching;
}

Template.Student_Courses_Of_Interest_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  coursesCount() {
    return matchingCourses().length;
  },
  courseInterests(course) {
    return Interests.findNames(course.interestIDs);
  },
  courseSemesters(semesterID) {
    const sem = Semesters.findDoc(semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return `${oppTerm} ${oppYear}`;
  },
  courseShortDescription(descript) {
    let description = descript;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}...`;
    }
    return description;
  },
  courses() {
    return matchingCourses();
  },

});

Template.Student_Courses_Of_Interest_Widget.events({

});

Template.Student_Courses_Of_Interest_Widget.onRendered(function studentCoursesOfInterestWidgetOnRendered() {

});
