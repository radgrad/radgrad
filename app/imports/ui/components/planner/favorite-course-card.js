import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../../../api/slug/SlugCollection';
import { makeCourseICE } from '../../../api/ice/IceProcessor';
import * as RouteNames from '../../../startup/client/router';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { satisfiesPlanChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Favorite_Course_Card.onCreated(function favoriteCourseCardOnCreated() {
  // add your statement here
});

Template.Favorite_Course_Card.helpers({
  course() {
    return Template.instance().data.course;
  },
  courseNumber() {
    const course = Template.instance().data.course;
    return course.number;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courseSlug() {
    const course = Template.instance().data.course;
    return Slugs.getNameFromID(course.slugID);
  },
  description() {
    const course = Template.instance().data.course;
    return course.description;
  },
  ice() {
    const course = Template.instance().data.course;
    const slug = Slugs.findDoc(course.slugID);
    const ice = makeCourseICE(slug.name, 'C');
    return ice;
  },
  interests() {
    return Template.instance().data.course.interestIDs;
  },
  instanceSemester() {
    const studentID = getUserIdFromRoute();
    const courseID = Template.instance().data.course._id;
    const instances = CourseInstances.findNonRetired({ studentID, courseID });
    const semesterNames = _.map(instances, (i) => Semesters.toString(i.semesterID, false));
    return semesterNames.join(', ');
  },
  name() {
    const course = Template.instance().data.course;
    return course.name;
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
  prereqName(prereq) {
    return PlanChoices.toStringFromSlug(prereq);
  },
  prerequisites() {
    const course = Template.instance().data.course;
    return course.prerequisites;
  },
});

Template.Favorite_Course_Card.events({
  // add your events here
});

Template.Favorite_Course_Card.onRendered(function favoriteCourseCardOnRendered() {
  // add your statement here
});

Template.Favorite_Course_Card.onDestroyed(function favoriteCourseCardOnDestroyed() {
  // add your statement here
});

