import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { plannerKeys } from './academic-plan';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

/* global document */

Template.Planned_Course_Grade.onCreated(function plannedCourseGradeOnCreated() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
});

Template.Planned_Course_Grade.helpers({
  hasGrade(courseInstanceID) {
    const ci = CourseInstances.findDoc(courseInstanceID);
    return ci.grade !== '***';
  },
  isGrade(courseInstanceID, grade) {
    try {
      const ci = CourseInstances.findDoc(courseInstanceID);
      return ci.grade === grade;
      /* eslint no-unused-vars: "off" */
    } catch (e) {
      return null;
    }
  },
});

Template.Planned_Course_Grade.events({
  'change': function change(event) { // eslint-disable-line
    event.preventDefault();
    const div = event.target.parentElement;

    const updateData = {};
    updateData.grade = div.childNodes[2].textContent;
    updateData.id = div.parentElement.id;
    const collectionName = CourseInstances.getCollectionName();
    const instance = Template.instance();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (!error) {
        const ci = CourseInstances.findDoc(updateData.id);
        instance.state.set(plannerKeys.detailICE, ci.ice);
        instance.state.set(plannerKeys.detailCourseInstance, ci);
        const course = CourseInstances.getCourseDoc(ci._id);
        const semester = Semesters.toString(ci.semesterID);
        // eslint-disable-next-line
        const message = `${getRouteUserName()} updated planned grade for ${ci.note} ${course.shortName} (${semester}) to ${grade}.`;
        appLog.info(message);
      } else {
        console.log('Error updating grade', error);
      }
    });
  },
});

Template.Planned_Course_Grade.onRendered(function plannedCourseGradeOnRendered() {
  this.$('.ui.selection.dropdown').dropdown();
  this.$('select.dropdown').dropdown();
  document.getElementsByTagName('body')[0].style.cursor = 'auto';
});
