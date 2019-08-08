import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import slugify, { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { getAllElementsWithAttribute, removeElement } from '../../../ui/utilities/dom-utilities';

/* global document */
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
  this.choice = new ReactiveVar('');
});

Template.Academic_Plan_Builder_Widget.helpers({
  academicYears() {
    const semesters = Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
    const years = _.uniqBy(semesters, (s) => s.year);
    return _.map(years, (y) => y.year);
  },
  choice() {
    if (Template.instance().choice.get()) {
      return buildSimpleName(Template.instance().choice.get());
    }
    return '';
  },
  courseName(slug) {
    if (slug) {
      return PlanChoices.toStringFromSlug(slug);
    }
    return '';
  },
  courses() {
    const choices = PlanChoices.findNonRetired();
    return _.map(choices, (c) => c.choice);
  },
  desiredDegrees() {
    return DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.validationErrors();
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
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  },
  selectedDesiredDegreeID() {
    return '';
  },
});

Template.Academic_Plan_Builder_Widget.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    const id = event.originalEvent.dataTransfer.getData('id');
    const slug = event.originalEvent.dataTransfer.getData('slug');
    const from = event.originalEvent.dataTransfer.getData('from');
    const numInPlan = getAllElementsWithAttribute('slug', slug).length;
    if (from === 'table' || from === 'combine') {
      removeElement(id);
    }
    const inPlan = Template.instance().inPlan.get();
    if (_.indexOf(inPlan, slug) === -1) {
      inPlan.push(slug);
    }
    Template.instance().inPlan.set(inPlan);
    const target = event.target;
    const div = document.createElement('div');
    div.setAttribute('id', `${slug}-${numInPlan}`);
    div.setAttribute('slug', slug);
    div.setAttribute('class', 'ui basic label');
    div.setAttribute('draggable', 'true');
    div.setAttribute('ondragstart', 'dragTable(event)');
    div.textContent = event.originalEvent.dataTransfer.getData('text');
    target.appendChild(div);
  },
  'drop .trash': function dropTrash(event) {
    // event.preventDefault();
    const id = event.originalEvent.dataTransfer.getData('id');
    const choiceP = event.originalEvent.dataTransfer.getData('from') === 'choice';
    if (!choiceP) {
      removeElement(id);
    }
  },
  'drop .comboArea': function dropCombo(event) {
    event.preventDefault();
    const slug = event.originalEvent.dataTransfer.getData('slug');
    const innerOrP = slug.split(',').length > 1;
    let element = event.target;
    while (element && !element.className.includes('segment')) {
      element = element.parentNode;
    }
    const divs = element.getElementsByTagName('div');
    if (divs && divs.length > 0) {
      const div = divs[0];
      const id = div.getAttribute('id');
      const oldID = id.substring(0, id.length - 8);
      let newSlug;
      if (innerOrP) {
        div.setAttribute('id', `${oldID},(${slug})-combine`);
        newSlug = `${oldID},(${slug})`;
        div.setAttribute('slug', newSlug);
      } else {
        div.setAttribute('id', `${oldID},${slug}-combine`);
        newSlug = `${oldID},${slug}`;
        div.setAttribute('slug', newSlug);
      }
      div.textContent = `${PlanChoices.toStringFromSlug(newSlug)}`;
    } else {
      const div = document.createElement('div');
      if (innerOrP) {
        div.setAttribute('id', `(${slug})-combine`);
      } else {
        div.setAttribute('id', `${slug}-combine`);
      }
      div.setAttribute('slug', slug);
      div.setAttribute('class', 'ui basic label');
      div.setAttribute('draggable', 'true');
      div.setAttribute('ondragstart', 'dragCombine(event)');
      div.textContent = PlanChoices.toStringFromSlug(slug);
      element.appendChild(div);
    }
  },
  'drop .choiceArea': function dropChoiceArea(event, instance) {
    event.preventDefault();
    const id = event.originalEvent.dataTransfer.getData('id');
    const slug = event.originalEvent.dataTransfer.getData('slug');
    Template.instance().choice.set(slug);
    const from = event.originalEvent.dataTransfer.getData('from');
    instance.$('.ui.basic.modal').modal({
      detachable: false,
      onApprove() {
        // console.log('choiceArea', id, slug, from);
        if (from === 'table' || from === 'combine') {
          removeElement(id);
        }
        const collectionName = PlanChoices.getCollectionName();
        const definitionData = {};
        definitionData.choice = slug;
        defineMethod.call({ collectionName, definitionData }, (error) => {
          if (error) {
            console.log('Error defining PlanChoice', error);
          }
        });
      },
    }).modal('show');
  },
  submit(event, instance) {
    // console.log('submit Plan');
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      const definitionData = {};
      const desiredDegree = DesiredDegrees.findDoc(newData.desiredDegree);
      const degreeSlug = Slugs.findDoc(desiredDegree.slugID).name;
      const name = newData.name;
      const semester = `Fall-${newData.year}`;
      const coursesPerSemester = [];
      const courseList = [];
      const collectionName = AcademicPlans.getCollectionName();
      let slug = `${name} ${newData.year}`;
      slug = `${slugify(slug)}`;
      const ays = instance.$('.academicYear');
      _.forEach(ays, (ay) => {
        const tables = ay.querySelectorAll('table');
        _.forEach(tables, (table) => {
          const divs = table.getElementsByTagName('div');
          coursesPerSemester.push(divs.length);
          _.forEach(divs, (div) => {
            courseList.push(div.getAttribute('id'));
          });
        });
      });
      definitionData.slug = slug;
      definitionData.degreeSlug = degreeSlug;
      definitionData.name = name;
      definitionData.description = name;
      definitionData.semester = semester;
      definitionData.coursesPerSemester = coursesPerSemester;
      definitionData.courseList = courseList;
      // console.log(degreeSlug, name, semester, coursesPerSemester, courseList);
      defineMethod.call({ collectionName, definitionData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
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

