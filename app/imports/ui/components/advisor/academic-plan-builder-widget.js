/* global document */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { PlanChoices } from '../../../api/degree/PlanChoiceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  desiredDegree: { type: String },
  name: { type: String },
  year: { type: Number },
});

function createSimpleName(slug) {
  const slugs = slug.split(',');
  if (slugs.length > 1) {
    let ret = '(';
    _.map(slugs, (s) => {
      ret = `${ret}${s.substring(0, 3).toUpperCase()} ${s.substring(3)} or `;
    });
    ret = `${ret.substring(0, ret.length - 4)})`;
    return ret;
  }
  return `${slug.substring(0, 3).toUpperCase()} ${slug.substring(3)}`;
}

function createName(slug) {
  // console.log('createName', slug);
  if (slug.indexOf('[') !== -1) {
    let ret = '';
    const complex = slug.split('],');
    _.map(complex, (c) => {
      let str = c.replace(/\[/g, '');
      str = str.replace(/]/g, '');
      ret = `${ret}${createSimpleName(str)} or `;
    });
    return ret.substring(0, ret.length - 4);
  }
  return createSimpleName(slug);
}

function removeElement(slug) {
  const element = document.getElementById(slug);
  if (element) {
    const parent = element.parentNode;
    parent.removeChild(element);
  }
}

function getAllElementsWithAttribute(attribute, value) {
  const matchingElements = [];
  const allElements = document.getElementsByTagName('*');
  for (let i = 0, n = allElements.length; i < n; i += 1) {
    if (allElements[i].getAttribute(attribute) !== null && allElements[i].getAttribute(attribute) === value) {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

/**
 * Returns an array of choices for use in the array of choice.
 * {
 *   "planChoice": [{ "choices": [{ "choice": ["ics101"] }] }]
 * }
 * @param slug
 */
function buildChoice(slug) {
  const inner = {};
  inner.choice = slug.split(',');
  // console.log(inner);
  return inner;
}

function buildPlanChoice(slug) {
  const planChoice = [];
  const outer = {};
  outer.choices = [];
  if (slug && slug.indexOf('[') === -1) {
    outer.choices.push(buildChoice(slug));
    planChoice.push(outer);
  } else
    if (slug) {
      const complex = slug.split('],');
      _.map(complex, (c) => {
        let str = c.replace(/\[/g, '');
        str = str.replace(/]/g, '');
        outer.choices.push(buildChoice(str));
      });
      planChoice.push(outer);
    }
  return planChoice;
}

Template.Academic_Plan_Builder_Widget.onCreated(function academicPlanWidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.state = new ReactiveDict();
  this.inPlan = new ReactiveVar('');
  this.inPlan.set([]);
  this.choice = new ReactiveVar('');
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
  choice() {
    if (Template.instance().choice.get()) {
      return createName(Template.instance().choice.get());
    }
    return '';
  },
  courseName(slug) {
    return createName(slug);
  },
  courses() {
    const ret = [];
    const choices = PlanChoices.find().fetch();
    _.map(choices, (choice) => {
      if (choice.planChoice.length === 1) {
        const planChoice = choice.planChoice[0];
        if (planChoice.choices.length > 1) {
          let str = '';
          _.map(planChoice.choices, (c) => {
            str = `${str}[${c.choice.toString()}],`;
          });
          ret.push(str.substring(0, str.length - 1));
        } else {
          const choiceObj = planChoice.choices[0];
          ret.push(choiceObj.choice.toString());
        }
      }
    });
    // _.pullAll(ret, Template.instance().inPlan.get());
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
    div.setAttribute('id', `${slug}${numInPlan}`);
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
      const text = div.textContent;
      const id = div.getAttribute('id');
      const oldID = id.substring(0, id.length - 8);
      if (innerOrP) {
        div.setAttribute('id', `${oldID},[${slug}]-combine`);
        div.setAttribute('slug', `${oldID},[${slug}]`);
      } else {
        div.setAttribute('id', `${oldID},${slug}-combine`);
        div.setAttribute('slug', `${oldID},${slug}`);
      }
      div.textContent = `${text} or ${createName(slug)}`;
    } else {
      const div = document.createElement('div');
      if (innerOrP) {
        div.setAttribute('id', `[${slug}]-combine`);
      } else {
        div.setAttribute('id', `${slug}-combine`);
      }
      div.setAttribute('slug', slug);
      div.setAttribute('class', 'ui basic label');
      div.setAttribute('draggable', 'true');
      div.setAttribute('ondragstart', 'dragCombine(event)');
      div.textContent = createName(slug);
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
        const planChoice = buildPlanChoice(slug);
        PlanChoices.define({ planChoice });
      },
    }).modal('show');
  },
  submit(event, instance) {
    console.log('submit Plan');
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      const desiredDegree = DesiredDegrees.findDoc(newData.desiredDegree);
      const degreeSlug = Slugs.findDoc(desiredDegree.slugID).name;
      const name = newData.name;
      const semester = `Fall-${newData.year}`;
      const coursesPerSemester = [];
      const courseList = [];
      const ays = instance.$('.academicYear');
      _.map(ays, (ay) => {
        const tables = ay.querySelectorAll('table');
        _.map(tables, (table) => {
          const divs = table.getElementsByTagName('div');
          coursesPerSemester.push(divs.length);
          _.map(divs, (div) => {
            const planChoice = buildPlanChoice(div.getAttribute('slug'));
            courseList.push({ planChoice });
          });
        });
      });
      console.log(degreeSlug, name, semester, coursesPerSemester, courseList);
      try {
        AcademicPlans.define({ degreeSlug, name, semester, coursesPerSemester, courseList });
        FormUtils.indicateSuccess(instance, event);
      } catch (e) {
        alert(e);
        FormUtils.indicateError(instance);
      }
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

