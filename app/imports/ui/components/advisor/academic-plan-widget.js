/* global document */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Academic_Plan_Widget.onCreated(function academicPlanWidgetOnCreated() {
  this.inPlan = new ReactiveVar('');
  this.inPlan.set([]);
});

Template.Academic_Plan_Widget.helpers({
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
  years() {
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  },
});

Template.Academic_Plan_Widget.events({
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
});

Template.Academic_Plan_Widget.onRendered(function academicPlanWidgetOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Widget.onDestroyed(function academicPlanWidgetOnDestroyed() {
  // add your statement here
});

