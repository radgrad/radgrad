import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Student_Courses_Of_Interest_Widget.onCreated(function studentCoursesOfInterestWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0) {
    const filtered = _.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
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

function hiddenCoursesHelper() {
  const courses = matchingCourses();
  let nonHiddenCourses;
  if (Template.instance().hidden.get()) {
    const user = Users.findDoc({ username: getRouteUserName() });
    nonHiddenCourses = _.filter(courses, (course) => {
          if (_.includes(user.hiddenCourseIDs, course._id)) {
      return false;
    }
    return true;
  });
  } else {
    nonHiddenCourses = courses;
  }
  return nonHiddenCourses;
}

Template.Student_Courses_Of_Interest_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  coursesCount() {
    Template.instance().hidden.get();
    return hiddenCoursesHelper().length;
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
    const courses = matchingCourses();
    let visibleCourses;
    if (Template.instance().hidden.get()) {
      visibleCourses = hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  },

});

Template.Student_Courses_Of_Interest_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
    console.log("hello");
  },
});

Template.Student_Courses_Of_Interest_Widget.onRendered(function studentCoursesOfInterestWidgetOnRendered() {

});
