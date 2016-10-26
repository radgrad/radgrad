import { Template } from 'meteor/templating';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';

function getRandomIntInclusive(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

Template.Add_Course_Item.helpers({
  whenScheduled(course) {
    return 'Every semester';
  },
  iceI(course) {
    return makeCourseICE(course, '').i;
  },
  iceC(course) {
    return makeCourseICE(course, '').c;
  },
  iceE(course) {
    return makeCourseICE(course, '').e;
  },
  recommendationStars(course) {
    const ice = makeCourseICE(course, '');
    let numStars = getRandomIntInclusive(1, 5);
    numStars += ice.c;
    let i;
    const retVal = [];
    for (i = 0; i < numStars; i += 1) {
      retVal.push(`${i}`);
    }
    return retVal;
  },
});

Template.Add_Course_Item.events({
  'click #fallAdd' (event) {
    event.preventDefault();
    const course = Template.instance().data.course;
    const slug = Slugs.findDoc(course.slugID);
    const ci = {};
    ci.semester = `Fall-${Template.instance().data.fallYear}`;
    ci.course = slug.name;
    ci.student = Template.instance().data.studentUsername;
    ci.creditHrs = course.creditHrs;
    ci.note = course.number;
    CourseInstances.define(ci);
  },
  'click #springAdd' (event) {
    event.preventDefault();
    const course = Template.instance().data.course;
    const slug = Slugs.findDoc(course.slugID);
    const ci = {};
    ci.semester = `Spring-${Template.instance().data.springYear}`;
    ci.course = slug.name;
    ci.student = Template.instance().data.studentUsername;
    ci.creditHrs = course.creditHrs;
    ci.note = course.number;
    CourseInstances.define(ci);
  },
  'click #summerAdd' (event) {
    event.preventDefault();
    const course = Template.instance().data.course;
    const slug = Slugs.findDoc(course.slugID);
    const ci = {};
    ci.semester = `Summer-${Template.instance().data.springYear}`;
    ci.course = slug.name;
    ci.student = Template.instance().data.studentUsername;
    ci.creditHrs = course.creditHrs;
    ci.note = course.number;
    CourseInstances.define(ci);
  },
});

Template.Add_Course_Item.onCreated(function () {
  // add your statement here
});

Template.Add_Course_Item.onRendered(function () {
  this.$('.ui.accordion')
      .accordion()
  ;
  this.$('.ui.icon.button').popup({ on: 'click', target: '.ui.icon.button' });
});

Template.Add_Course_Item.onDestroyed(function () {
  // add your statement here
});

