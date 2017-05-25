import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as planChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';

// /** @module ui/components/advisor/Academic_Plan_Semester */

function takenSlugs(courseInstances) {
  return _.map(courseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

function checkIfPlanSlugIsSatified(takenCourseSlugs, planCourseSlugs, planSlug) {
  let ret = false;
  const countIndex = planSlug.indexOf('-');
  const planCount = parseInt(planSlug.substring(countIndex + 1), 10);
  const depts = planChoiceUtils.getDepartments(planSlug);
  if (planCount === 1) {  // Only need one instance of the planSlug in the takenCourseSlugs
    if (planSlug.indexOf('400+') !== -1) {  // 400 or above choice
      _.forEach(takenCourseSlugs, (s) => {
        _.forEach(depts, (d) => {
          if (s.startsWith(`${d}_4`)) {
            ret = true;
          }
        });
      });
    } else
      if (planSlug.indexOf('300+') !== -1) {  // 300 or above choice
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
      } else {  // specific plan choice must match
        _.forEach(takenCourseSlugs, (slug) => {
          if (planSlug.indexOf(slug) !== -1) {
            ret = true;
          }
        });
      }
  } else // multiple choices so we need to count the matches.
    if (planSlug.indexOf('400+') !== -1) {
      let c = 0;
      _.forEach(takenCourseSlugs, (s) => {
        _.forEach(depts, (d) => {
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

Template.Academic_Plan_Semester.helpers({
  choiceLabel(course) {
    return PlanChoices.toStringFromSlug(course);
  },
  inPlan(course) {
    const planCourses = Template.instance().data.plan.courseList;
    const studentID = getUserIdFromRoute();
    if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
      const courses = CourseInstances.find({ studentID }).fetch();
      const courseSlugs = takenSlugs(courses);
      return checkIfPlanSlugIsSatified(courseSlugs, planCourses, course);
    }
    return true;
  },
});
