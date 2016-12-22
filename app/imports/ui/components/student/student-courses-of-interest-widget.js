import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Courses_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Courses_Of_Interest_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  courses() {
    const allCourses = Courses.find().fetch();
    const matchingCourses = [];
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
      if (!_.includes(matchingCourses, course)) {
        matchingCourses.push(course);
      }
    }
  });
  });
  });
  });
    return matchingCourses;
  },
  coursesCount() {
    return Courses.find().count();
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
});

Template.Student_Courses_Of_Interest_Widget.events({

});

Template.Student_Courses_Of_Interest_Widget.onRendered(function studentCoursesOfInterestWidgetOnRendered() {

});
