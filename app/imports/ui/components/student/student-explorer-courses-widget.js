import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Courses_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  futureInstance(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    for (const courseInstance of ci) {
      if (Semesters.findDoc(courseInstance.semesterID).sortBy >= Semesters.getCurrentSemesterDoc().sortBy) {
        ret = true;
      }
    }
    return ret;
  },
  getTableTitle(tableIndex) {
    switch (tableIndex) {
      case 0:
        return '<h4><i class="green checkmark icon"></i>Completed</h4>';
      case 1:
        return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        return '<h4><i class="red warning circle icon"></i>Not in Plan';
      default:
        return 'ERROR: More than one table.';
    }
  },
  isLabel(label, value) {
    return label === value;
  },
  passedCourse(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    for (const c of ci) {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' ||
          c.grade === 'B+' || c.grade === 'B') {
        ret = true;
      }
    }
    return ret;
  },
  review() {
    let review = '';
    review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: this.item._id,
    }).fetch();
    return review[0];
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userStatus(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = true;
    }
    return ret;
  },
});

Template.Student_Explorer_Courses_Widget.events({
  'click .addItem': function clickAddItem(event) {
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
      grade: 'B',
      student: username,
    };
    CourseInstances.define(ci);
    FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
    FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
  },
});

Template.Student_Explorer_Courses_Widget.onCreated(function studentExplorerCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(1), this.data.item._id);
  });
});

Template.Student_Explorer_Courses_Widget.onRendered(function studentExplorerCoursesWidgetOnRendered() {

});

