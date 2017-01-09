import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';


Template.Student_Explorer_Menu.helpers({
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentExplorerDegreesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  courseName(course) {
    return course.shortName;
  },
  courseSlugName(course) {
    return Slugs.findDoc(course.slugID).name;
  },
  firstCourse() {
    const course = Courses.find({ number: 'ICS 101' }).fetch();
    return Slugs.findDoc(course[0].slugID).name;
  },
});


Template.Student_Explorer_Menu.onCreated(function studentExplorerMenuOnCreated() {
  this.subscribe(Courses.getPublicationName());
});