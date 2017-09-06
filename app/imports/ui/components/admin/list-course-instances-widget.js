import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

Template.List_Course_Instances_Widget.onCreated(function onCreated() {
  this.subscribe(CourseInstances.getPublicationName());
});

Template.List_Course_Instances_Widget.helpers({
  courseInstances() {
    const allCourseInstances = CourseInstances.find().fetch();
    const sortBySemester = _.sortBy(allCourseInstances, function (ci) {
      return Semesters.toString(ci.semesterID, true);
    });
    return _.sortBy(sortBySemester, function (ci) {
      return Users.getProfile(ci.studentID).username;
    });
  },
  count() {
    return CourseInstances.count();
  },
  name(courseInstance) {
    const username = Users.getProfile(courseInstance.studentID).username;
    const courseNum = Courses.findDoc(courseInstance.courseID).number;
    const semester = Semesters.toString(courseInstance.semesterID, true);
    return `${username}-${courseNum}-${semester}`;
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(courseInstance) {
    return [
      { label: 'Semester', value: Semesters.toString(courseInstance.semesterID) },
      { label: 'Course', value: (Courses.findDoc(courseInstance.courseID)).name },
      { label: 'Verified', value: courseInstance.verified.toString() },
      { label: 'fromSTAR', value: courseInstance.fromSTAR.toString() },
      { label: 'Grade', value: courseInstance.grade },
      { label: 'CreditHrs', value: courseInstance.creditHrs },
      { label: 'Note', value: courseInstance.note },
      { label: 'Student', value: Users.getFullName(courseInstance.studentID) },
      { label: 'ICE', value: `${courseInstance.ice.i}, ${courseInstance.ice.c}, 
        ${courseInstance.ice.e}` },
    ];
  },
});

Template.List_Course_Instances_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'CourseInstanceCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
