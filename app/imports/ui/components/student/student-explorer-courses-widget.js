import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  }).fetch();
  _.map(ci, (c) => {
    if (c.verified === true) {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' || c.grade === 'B+' ||
        c.grade === 'B' || c.grade === 'B-') {
        ret = 'Completed';
      } else {
        ret = 'In plan, but not yet complete';
      }
    } else {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
}

Template.Student_Explorer_Courses_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return Users.findDoc(user).picture;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courseName(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  passedCourse(courseSlugName) {
    return passedCourseHelper(courseSlugName);
  },
  rowColor(courseSlugName) {
    let ret = '';
    const passed = passedCourseHelper(courseSlugName);
    if (passed === 'Completed') {
      ret = 'positive';
    } else if (passed === 'In plan, but not yet complete') {
      ret = 'warning';
    } else {
      ret = 'negative';
    }
    return ret;
  },
  icon(courseSlugName) {
    let ret = '';
    const passed = passedCourseHelper(courseSlugName);
    if (passed === 'Completed') {
      ret = 'icon checkmark';
    } else if (passed === 'In plan, but not yet complete') {
      ret = 'warning sign icon';
    } else {
      ret = 'warning circle icon';
    }
    return ret;
  },
});

Template.Student_Explorer_Courses_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const item = event.target.value;
    const studentItems = student.careerGoalIDs;
    try {
      studentItems.push(item);
      console.log(item);
      Users.setCareerGoalIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
});

Template.Student_Explorer_Courses_Widget.onCreated(function studentExplorerCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});
