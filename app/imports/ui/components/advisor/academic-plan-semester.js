import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as planChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';

function takenSlugs(courseInstances) {
  return _.map(courseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

function removeTakenCourses(takenCourseSlugs, planCourseSlugs) {
  return _.filter(takenCourseSlugs, function (o) {
    return !_.find(planCourseSlugs, function (p) {
      return p.indexOf(o) !== -1;
    });
  });
}

function checkIfPlanSlugIsSatisfied(takenCourseSlugs, planCourseSlugs, planSlug) {
  let ret = false;
  const countIndex = planSlug.indexOf('-');
  let planCount = 1;
  if (countIndex !== -1) {
    planCount = parseInt(planSlug.substring(countIndex + 1), 10);
  }
  const depts = planChoiceUtils.getDepartments(planSlug);
  const cleanedTaken = removeTakenCourses(takenCourseSlugs, planCourseSlugs);
  if (planCount === 1) { // Only need one instance of the planSlug in the takenCourseSlugs
    if (planSlug.indexOf('400+') !== -1) { // 400 or above choice
      _.forEach(cleanedTaken, (s) => {
        _.forEach(depts, (d) => {
          if (s.startsWith(`${d}_4`)) {
            ret = true;
          }
        });
      });
    } else if (planSlug.indexOf('300+') !== -1) { // 300 or above choice
      const pcs = planCourseSlugs.slice();
      const tcs = takenCourseSlugs.slice();
      _.forEach(takenCourseSlugs, (ts) => {
        const pcsLen = pcs.length;
        _.remove(pcs, function match(slug) {
          return slug.startsWith(ts);
        });
        if (pcsLen !== pcs.length) {
          _.remove(tcs, function match(slug) {
            return slug === ts;
          });
        }
      });
      _.forEach(tcs, (slug) => {
        _.forEach(depts, (d) => {
          if (slug.startsWith(`${d}_3`) || slug.startsWith(`${d}_4`)) {
            ret = true;
          }
        });
      });
    } else { // specific plan choice must match
      _.forEach(takenCourseSlugs, (slug) => {
        if (planSlug.indexOf(slug) !== -1) {
          ret = true;
        }
      });
    }
  } else // multiple choices so we need to count the matches.
  if (planSlug.indexOf('400+') !== -1) {
    let c = 0;
    _.forEach(cleanedTaken, (s) => {
      _.forEach(depts, (d) => {
        if (s.startsWith(`${d}_4`)) {
          c += 1;
        }
      });
    });
    ret = c >= planCount;
  } else if (planSlug.indexOf('300+') !== -1) {
    const pcs = planCourseSlugs.slice();
    const tcs = takenCourseSlugs.slice();
    _.forEach(takenCourseSlugs, (ts) => {
      const pcsLen = pcs.length;
      _.remove(pcs, function match(slug) {
        return slug.startsWith(ts);
      });
      if (pcsLen !== pcs.length) {
        _.remove(tcs, function match(slug) {
          return slug === ts;
        });
      }
    });
    let c = 0;
    _.forEach(tcs, (slug) => {
      _.forEach(depts, (d) => {
        if (slug.startsWith(`${d}_3`) || slug.startsWith(`${d}_4`)) {
          c += 1;
        }
      });
    });
    ret = c >= planCount;
  } else {
    let c = 0;
    _.forEach(takenCourseSlugs, (slug) => {
      if (planSlug.indexOf(slug) !== -1) {
        c += 1;
      }
    });
    ret = c >= planCount;
  }
  return ret;
}

Template.Academic_Plan_Semester.onCreated(function academicPlanSemesterOnCreated() {
  // console.log(this.data);
  this.state = this.data.dictionary;
});

Template.Academic_Plan_Semester.helpers({
  canDrag(course) {
    return planChoiceUtils.isSingleChoice(course) && !planChoiceUtils.isXXChoice(course);
  },
  choiceLabel(course) {
    return course && PlanChoices.toStringFromSlug(course);
  },
  choices(course) {
    return course && planChoiceUtils.complexChoiceToComplexArray(course);
  },
  courseName(planSlug) {
    if (getUserIdFromRoute()) {
      let inPlan = false;
      const planCourses = Template.instance().data.plan.courseList;
      const studentID = getUserIdFromRoute();
      if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
        const courses = CourseInstances.findNonRetired({ studentID });
        const courseSlugs = takenSlugs(courses);
        inPlan = checkIfPlanSlugIsSatisfied(courseSlugs, planCourses, planSlug);
      } else {
        inPlan = true;
      }
      if (planChoiceUtils.isSingleChoice(planSlug)) {
        if (!planChoiceUtils.isXXChoice(planSlug)) {
          const courseSlug = planChoiceUtils.stripCounter(planSlug);
          const course = Courses.findDocBySlug(courseSlug);
          return `${course.name} ${inPlan ? '' : ': drag to add to plan'} `;
        }
        if (!inPlan) {
          return 'Use the Explorer/Inspector to choose a course';
        }
        return 'Satisfied';
      }
    }
    return '';
  },
  courseSlug(course) {
    if (planChoiceUtils.isSingleChoice(course)) {
      return planChoiceUtils.stripCounter(course);
    }
    return '';
  },
  inPlan(course) {
    if (course && getUserIdFromRoute()) {
      // console.log('inPlan(%o)', course);
      const planCourses = Template.instance().data.plan.courseList;
      const studentID = getUserIdFromRoute();
      if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
        const courses = CourseInstances.findNonRetired({ studentID });
        const courseSlugs = takenSlugs(courses);
        return checkIfPlanSlugIsSatisfied(courseSlugs, planCourses, course);
      }
      return true;
    }
    return false;
  },
  isSingleChoice(course) {
    // console.log('isSingleChoice %o', course);
    return planChoiceUtils.isSingleChoice(course);
  },
});

Template.Academic_Plan_Semester.events({
  click: function click(event) {
    event.preventDefault();
    const slug = event.target.getAttribute('course-slug');
    if (Slugs.isDefined(slug)) {
      const courseID = Slugs.getEntityID(slug, 'Course');
      const course = Courses.findDoc(courseID);
      const instance = Template.instance();
      const ci = CourseInstances.findNonRetired({ courseID, studentID: getUserIdFromRoute() });
      if (ci.length > 0) {
        instance.state.set('detailCourse', null);
        instance.state.set('detailCourseInstance', ci[0]);
        instance.state.set('detailICE', ci[0].ice);
        instance.state.set('detailOpportunity', null);
        instance.state.set('detailOpportunityInstance', null);
      } else {
        instance.state.set('detailCourse', course);
        instance.state.set('detailCourseInstance', null);
        instance.state.set('detailOpportunity', null);
        instance.state.set('detailOpportunityInstance', null);
        getFutureEnrollmentMethod.call(courseID, (error, result) => {
          if (error) {
            console.log('Error in getting future enrollment', error);
          } else if (course._id === result.courseID) {
            instance.state.set('plannedEnrollment', result);
          }
        });
      }
    }
  },
});

Template.Academic_Plan_Semester.onRendered(function academicPlanSemesterOnRendered() {
  this.$('.label')
    .popup({});
});
