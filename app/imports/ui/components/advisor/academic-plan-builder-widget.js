/* global document */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

// const CourseChoiceSchema = new SimpleSchema({
//   course: { type: [String] },
// });

const addSchema = new SimpleSchema({
  desiredDegree: { type: String },
  name: { type: String },
  year: { type: Number },
});

Template.Academic_Plan_Builder_Widget.onCreated(function academicPlanWidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.state = new ReactiveDict();
  this.inPlan = new ReactiveVar('');
  this.inPlan.set([]);
});

Template.Academic_Plan_Builder_Widget.helpers({
  academicYears() {
    const ret = [];
    const semesters = Semesters.find({}, { sort: { semesterNumber: 1 } }).fetch();
    _.map(semesters, (s) => {
      if (_.indexOf(ret, s.year) === -1) {
        ret.push(s.year);
      }
    });
    return ret;
  },
  courseName(slug) {
    return `${slug.substring(0, 3).toUpperCase()} ${slug.substring(3)}`;
  },
  courses() {
    const ret = [];
    const courses = Courses.find({}, { sort: { number: 1 } }).fetch();
    _.map(courses, (course) => {
      const slug = Slugs.findDoc(course.slugID).name;
      if (!slug.startsWith('other')) {
        ret.push(slug);
      }
    });
    _.pullAll(ret, Template.instance().inPlan.get());
    ret.push('ics4xx');
    return ret;
  },
  desiredDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } });
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  errorClass() {
    return Template.instance().errorClass.get() ? 'error' : '';
  },
  fieldErrorMessage(fieldName) {
    return Template.instance().context.keyErrorMessage(fieldName);
  },
  successClass() {
    return Template.instance().successClass.get() ? 'success' : '';
  },
  years() {
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  },
  selectedDesiredDegreeID() {
    return '';
  },
});

Template.Academic_Plan_Builder_Widget.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    const slug = event.originalEvent.dataTransfer.getData('text');
    const fromTable = event.originalEvent.dataTransfer.getData('fromTable');
    if (fromTable) {
      console.log('from table');
      const element = document.getElementById(slug);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
    const inPlan = Template.instance().inPlan.get();
    if (_.indexOf(inPlan, slug) === -1) {
      inPlan.push(slug);
    }
    Template.instance().inPlan.set(inPlan);
    const target = event.target;
    target.setAttribute('draggable', true);
    target.setAttribute('ondragstart', 'dragTable(event)');
    const inner = target.innerHTML;
    if (!inner) {
      target.setAttribute('id', slug);
      target.innerHTML = `<strong>${slug.substring(0, 3).toUpperCase()} ${slug.substring(3)}</strong>`;
    } else {
      const oldID = target.getAttribute('id');
      target.setAttribute('id', `${oldID},${slug}`);
      target.innerHTML = `${inner} or <strong>${slug.substring(0, 3).toUpperCase()} ${slug.substring(3)}</strong>`;
    }
  },
  'drop .trash': function dropTrash(event) {
    // event.preventDefault();
    const slug = event.originalEvent.dataTransfer.getData('text');
    const slugs = slug.split(',');
    const element = document.getElementById(slug);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    const inPlan = Template.instance().inPlan.get();
    _.pullAll(inPlan, slugs);
    Template.instance().inPlan.set(inPlan);
  },
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    const desiredDegree = DesiredDegrees.findDoc(newData.desiredDegree);
    const degreeSlug = Slugs.findDoc(desiredDegree.slugID).name;
    const semester = `Fall-${newData.year}`;
    const coursesPerSemester = [];
    const courseList = [];
    const ays = instance.$('.academicYear');
    _.map(ays, (ay) => {
      console.log(ay);
    });
    console.log(degreeSlug, semester, coursesPerSemester, courseList);
    if (instance.context.isValid()) {
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

Template.Academic_Plan_Builder_Widget.onRendered(function academicPlanWidgetOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Builder_Widget.onDestroyed(function academicPlanWidgetOnDestroyed() {
  // add your statement here
});

