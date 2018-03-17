import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ReactiveVar } from 'meteor/reactive-var';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { upComingSemesters } from '../../../api/semester/SemesterUtilities';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Courses } from '../../../api/course/CourseCollection';

Template.Course_Score_Board_Widget.onCreated(function courseScoreBoardWidgetOnCreated() {
  this.byICS = new ReactiveVar(false);
  this.byEE = new ReactiveVar(false);
  this.by1xx = new ReactiveVar(false);
  this.by2xx = new ReactiveVar(false);
  this.by3xx = new ReactiveVar(false);
  this.by4xx = new ReactiveVar(false);
});

Template.Course_Score_Board_Widget.helpers({
  courseCount(course, semester) {
    const count = CourseInstances.find({ courseID: course._id, semesterID: semester._id }).count();
    return count;
  },
  courseName(course) {
    return course.number;
  },
  courses() {
    let courses = Courses.find({}, { sort: { number: 1 } }).fetch();
    courses = _.filter(courses, function (c) {
      return c.number !== 'other';
    });
    if (Template.instance().byICS.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('ICS');
        return regex.test(c.number);
      });
    }
    if (Template.instance().byEE.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('EE|CEE|ME|OE|BE');
        return regex.test(c.number);
      });
    }
    if (Template.instance().by1xx.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('1[0-9][0-9]');
        return regex.test(c.number);
      });
    }
    if (Template.instance().by2xx.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('2[0-9][0-9]');
        return regex.test(c.number);
      });
    }
    if (Template.instance().by3xx.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('3[0-9][0-9]');
        return regex.test(c.number);
      });
    }
    if (Template.instance().by4xx.get()) {
      courses = _.filter(courses, function (c) {
        const regex = new RegExp('4[0-9][0-9]');
        return regex.test(c.number);
      });
    }

    return courses;
  },
  isHighE() {
    return Template.instance().by1xx.get();
  },
  isEE() {
    return Template.instance().byEE.get();
  },
  isICS() {
    return Template.instance().byICS.get();
  },
  is1xx() {
    return Template.instance().by1xx.get();
  },
  is2xx() {
    return Template.instance().by2xx.get();
  },
  is3xx() {
    return Template.instance().by3xx.get();
  },
  is4xx() {
    return Template.instance().by4xx.get();
  },
  semesterName(semester) {
    return Semesters.getShortName(semester);
  },
  upcomingSemesters() {
    const semesters = upComingSemesters();
    return semesters;
  },
});

Template.Course_Score_Board_Widget.events({
  click: function (event, instance) {
    event.preventDefault();
    console.log(event.target, instance);
  },
  'click .jsByICS': function clickedInterests(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by ICS');
    instance.byICS.set(!instance.byICS.get());
  },
  'click .jsByEE': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by EE');
    instance.byEE.set(!instance.byEE.get());
  },
  'click .jsBy1xx': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 1xx');
    instance.by1xx.set(!instance.by1xx.get());
  },
  'click .jsBy2xx': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 2xx');
    instance.by2xx.set(!instance.by2xx.get());
  },
  'click .jsBy3xx': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 3xx');
    instance.by3xx.set(!instance.by3xx.get());
  },
  'click .jsBy4xx': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 4xx');
    instance.by4xx.set(!instance.by4xx.get());
  },
});

Template.Course_Score_Board_Widget.onRendered(function courseScoreBoardWidgetOnRendered() {
  // add your statement here
});

Template.Course_Score_Board_Widget.onDestroyed(function courseScoreBoardWidgetOnDestroyed() {
  // add your statement here
});

