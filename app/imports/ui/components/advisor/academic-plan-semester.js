import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PlanChoices } from '../../../api/degree/PlanChoiceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Roles } from 'meteor/alanning:roles';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

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
  if (planCount === 1) {
    if (planSlug.startsWith('ics4xx')) {
      _.map(takenCourseSlugs, (s) => {
        if (s.startsWith('ics4')) {
          ret = true;
        }
      });
    } else
      if (planSlug.startsWith('ics300+')) {
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
          if (slug.startsWith('ics3') || slug.startsWith('ics4')) {
            ret = true;
          }
        });
      } else {
        _.map(takenCourseSlugs, (slug) => {
          if (planSlug.indexOf(slug) !== -1) {
            ret = true;
          }
        });
      }
  } else
    if (planSlug.startsWith('ics4xx')) {
      let c = 0;
      _.map(takenCourseSlugs, (s) => {
        if (s.startsWith('ics4')) {
          c += 1;
        }
      });
      ret = c >= planCount;
    } else
      if (planSlug.startsWith('ics300+')) {
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
          if (slug.startsWith('ics3') || slug.startsWith('ics4')) {
            c += 1;
          }
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

