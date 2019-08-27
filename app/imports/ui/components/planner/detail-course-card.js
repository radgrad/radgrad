import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { plannerKeys } from './academic-plan';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as RouteNames from '../../../startup/client/router';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { satisfiesPlanChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Detail_Course_Card.onCreated(function detailCourseCardOnCreated() {
  this.state = this.data.dictionary;
});

Template.Detail_Course_Card.helpers({
  course() {
    return Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
  },
  courseInstance() {
    return Template.instance().state.get(plannerKeys.detailsCourse);
  },
  courseNumber() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return course.number;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courseSlug() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return Slugs.getNameFromID(course.slugID);
  },
  description() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return course.description;
  },
  futureInstance() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const instanceSemester = Semesters.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).semesterID);
    return instanceSemester.semesterNumber >= currentSemester.semesterNumber;
  },
  ice() {
    return Template.instance().state.get(plannerKeys.detailsCourse).ice;
  },
  interests() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return course.interestIDs;
  },
  missingPrerequisite(prereqSlug) {
    const studentID = getUserIdFromRoute();
    const courseInstances = CourseInstances.find({ studentID }).fetch();
    let ret = true;
    _.forEach(courseInstances, (ci) => {
      const courseSlug = CourseInstances.getCourseSlug(ci._id);
      // console.log(prereqSlug, courseSlug, satisfiesPlanChoice(prereqSlug, courseSlug))
      if (satisfiesPlanChoice(prereqSlug, courseSlug)) {
        ret = false;
      }
    });
    return ret;
  },
  name() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return course.name;
  },
  prereqName(prereq) {
    return PlanChoices.toStringFromSlug(prereq);
  },
  prerequisites() {
    const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailsCourse).courseID);
    return course.prerequisites;
  },
  semester() {
    return Semesters.toString(Template.instance().state.get(plannerKeys.detailsCourse).semesterID, false);
  },
});

Template.Detail_Course_Card.events({
  // add your events here
});

Template.Detail_Course_Card.onRendered(function detailCourseCardOnRendered() {
  // add your statement here
});

Template.Detail_Course_Card.onDestroyed(function detailCourseCardOnDestroyed() {
  // add your statement here
});

