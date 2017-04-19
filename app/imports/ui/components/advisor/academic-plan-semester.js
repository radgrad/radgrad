import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Roles } from 'meteor/alanning:roles';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

let electiveCount = 0;

Template.Academic_Plan_Semester.onCreated(function academicPlanSemesterOnCreated() {
  // console.log(this.data);
});

Template.Academic_Plan_Semester.helpers({
  choiceLabel(course) {
    if (course) {
      let str = '';
      _.map(course, (c) => {
        str = `${str} or ${c}`;
      });
      str = str.substring(4, str.length);
      return str;
    }
    return '';
  },
  inPlan(course) {
    const studentID = getUserIdFromRoute();
    // const courseReqs = Template.instance().data.courses;
    // console.log(courseReqs);
    let ret = false;
    if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
      const courses = CourseInstances.find({ studentID }).fetch();
      _.map(courses, (c) => {
        const doc = CourseInstances.getCourseDoc(c._id);
        const slug = Slugs.getNameFromID(doc.slugID);
        if (_.indexOf(course, slug) !== -1) {
          ret = true;
        }
      });
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

