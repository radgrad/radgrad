import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Roles } from 'meteor/alanning:roles';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as planChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';

// /** @module ui/components/advisor/Academic_Plan_Semester */

function takenSlugs(courseInstances) {
  const ret = [];
  _.map(courseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    ret.push(Slugs.getNameFromID(doc.slugID));
  });
  return ret;
}

function fooBar(takenCourseSlugs, planCourseSlugs, planSlug) {
  let ret = false;
  const countIndex = planSlug.indexOf('-');
  const planCount = parseInt(planSlug.substring(countIndex + 1), 10);
  const depts = planChoiceUtils.getDepartments(planSlug);
  if (planCount === 1) {
    if (planSlug.indexOf('400+') !== -1) {
      _.map(takenCourseSlugs, (s) => {
        _.map(depts, (d) => {
          if (s.startsWith(`${d}_4`)) {
            ret = true;
          }
        });
      });
    } else
      if (planSlug.indexOf('300+') !== -1) {
        const pcs = planCourseSlugs.slice();
        const tcs = takenCourseSlugs.slice();
        _.map(takenCourseSlugs, (ts) => {
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
        _.map(tcs, (slug) => {
          _.map(depts, (d) => {
            if (slug.startsWith(`${d}_3`) || slug.startsWith(`${d}_4`)) {
              ret = true;
            }
          });
        });
      } else {
        _.map(takenCourseSlugs, (slug) => {
          if (planSlug.indexOf(slug) !== -1) {
            ret = true;
          }
        });
      }
  } else
    if (planSlug.indexOf('400+') !== -1) {
      let c = 0;
      _.map(takenCourseSlugs, (s) => {
        _.map(depts, (d) => {
          if (s.startsWith(`${d}_4`)) {
            c += 1;
          }
        });
      });
      ret = c >= planCount;
    } else
      if (planSlug.indexOf('300+') !== -1) {
        const pcs = planCourseSlugs.slice();
        const tcs = takenCourseSlugs.slice();
        _.map(takenCourseSlugs, (ts) => {
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
        _.map(tcs, (slug) => {
          _.map(depts, (d) => {
            if (slug.startsWith(`${d}_3`) || slug.startsWith(`${d}_4`)) {
              c += 1;
            }
          });
        });
        ret = c >= planCount;
      } else {
        let c = 0;
        _.map(takenCourseSlugs, (slug) => {
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
});

Template.Academic_Plan_Semester.helpers({
  choiceLabel(course) {
    return PlanChoices.toStringFromSlug(course);
  },
  inPlan(course) {
    const planCourses = Template.instance().data.plan.courseList;
    const studentID = getUserIdFromRoute();
    let ret = false;
    if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
      const courses = CourseInstances.find({ studentID }).fetch();
      const courseSlugs = takenSlugs(courses);
      ret = fooBar(courseSlugs, planCourses, course);
    }
    return ret;
  },
});

Template.Academic_Plan_Semester.events({
  // add your events here
});

Template.Academic_Plan_Semester.onRendered(function academicPlanSemesterOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Semester.onDestroyed(function academicPlanSemesterOnDestroyed() {
  // add your statement here
});

