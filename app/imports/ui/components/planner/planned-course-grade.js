/* global document */

import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { plannerKeys } from './academic-plan';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';

// /** @module ui/components/planner/Planned_Course_Grade */

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
    const grade = div.childNodes[2].textContent;
    const id = div.parentElement.id;
    CourseInstances.clientUpdateGrade(id, grade);
    const ci = CourseInstances.findDoc(id);
    const template = Template.instance();
    template.state.set(plannerKeys.detailICE, ci.ice);
    template.state.set(plannerKeys.detailCourseInstance, ci);
  },
});

Template.Planned_Course_Grade.onRendered(function plannedCourseGradeOnRendered() {
  this.$('.ui.selection.dropdown').dropdown();
  this.$('select.dropdown').dropdown();
  document.getElementsByTagName('body')[0].style.cursor = 'auto';
});
