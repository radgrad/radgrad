import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveDict } from 'meteor/reactive-dict';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0 && Template.instance().state.get('semester')) {
    const filtered = lodash.filter(courses, function (course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: Meteor.userId(),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    return filtered;
  }
  return [];
};

const available1xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 1';
  });
  return filtered;
};

const available2xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 2';
  });
  return filtered;
};

const available3xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 3';
  });
  return filtered;
};

const available4xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 4';
  });
  return filtered;
};

const resizePopup = () => {
  $('.ui.popup').css('max-height', '350px');
};

$(window).resize(function (e) {
  resizePopup();
});

Template.Semester_List.helpers({
  semesterName() {
    const semester = Template.instance().state.get('semester');
    if (semester) {
      return semester.term;
    }
    return null;
  },
  year() {
    const semester = Template.instance().state.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
  isFuture() {
    const semester = Template.instance().state.get('semester');
    const currentSemester = Template.instance().state.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy >= currentSemester.sortBy;
    }
    return null;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  hasCourses(level) {
    let ret = false;
    switch (level) {
      case 100:
        ret = available1xxCourses().length !== 0;
        break;
      case 200:
        ret = available2xxCourses().length !== 0;
        break;
      case 300:
        ret = available3xxCourses().length !== 0;
        break;
      case 400:
        ret = available4xxCourses().length !== 0;
        break;
      default:
        ret = false;
    }
    return ret;
  },
  courses(level) {
    const ret = [];
    const courses = availableCourses();
    courses.forEach((course) => {
      const cNumber = course.number;
      switch (level) {
        case 100:
          if (cNumber.substring(0, 5) === 'ICS 1') {
            ret.push(cNumber);
          }
          break;
        case 200:
          if (cNumber.substring(0, 5) === 'ICS 2') {
            ret.push(cNumber);
          }
          break;
        case 300:
          if (cNumber.substring(0, 5) === 'ICS 3') {
            ret.push(cNumber);
          }
          break;
        case 400:
          if (cNumber.substring(0, 5) === 'ICS 4') {
            ret.push(cNumber);
          }
          break;
        default:
          break;
      }
    });
    return ret;
  },
  nonIcsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }).fetch();
      courses.forEach((c) => {
        if (!CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  working() {
    if (Template.instance().state) {
      return Template.instance().state.get('working');
    }
    return false;
  },
});

Template.Semester_List.events({
  'drop .bodyDrop'(event) {
    event.preventDefault();
    // console.log(event.originalEvent.dataTransfer.getData('text'));
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        note: event.originalEvent.dataTransfer.getData('text'),
        studentID: Meteor.userId(),
      }).fetch();
      if (courses.length > 0) {
        // console.log(courses[0]);
        CourseInstances.updateSemester(courses[0]._id, Template.instance().state.get('semester')._id);
      }
    }
  },
  'click .item.addClass'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const courseSplit = event.target.text.split(' ');
    const courseSlug = `${courseSplit[0].toLowerCase()}${courseSplit[1]}`;
    const semester = template.state.get('semester');
    const semStr = Semesters.toString(semester._id, false);
    const semSplit = semStr.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Meteor.user().username;
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: event.target.text,
      grade: '***',
      student: username,
    };
    template.state.set('working', true);
    CourseInstances.define(ci);
    Tracker.afterFlush(() => {
      template.$('.ui.icon.mini.button')
          .popup({
            on: 'click',
          });
      template.$('.item.course')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('.courseInstance').popup({
        inline: true, hoverable: true, position: 'right center',
      });
      template.$('a.100.item')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.200.item')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.300.item')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.400.item')
          .popup({
            inline: true,
            hoverable: true,
            lastResort: 'right center',
            onShow: function () {
              resizePopup();
            },
          });
      template.state.set('working', false);
    });
  },
});

Template.Semester_List.onCreated(function semesterListOnCreate() {
  this.state = new ReactiveDict();
});

Template.Semester_List.onRendered(function semesterListOnRendered() {
  // console.log(this.data);
  if (this.data) {
    this.state.set('semester', this.data.semester);
    this.state.set('currentSemester', this.data.currentSemester);
  }
  this.state.set('working', false);
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.icon.mini.button')
        .popup({
          on: 'click',
        });
    template.$('.item.course')
        .popup({
          inline: true,
          hoverable: true,
        });
    template.$('.courseInstance').popup({
      inline: true, hoverable: true, position: 'right center',
    });
    template.$('a.100.item')
        .popup({
          inline: true,
          hoverable: true,
        });
    template.$('a.200.item')
        .popup({
          inline: true,
          hoverable: true,
        });
    template.$('a.300.item')
        .popup({
          inline: true,
          hoverable: true,
        });
    template.$('a.400.item')
        .popup({
          inline: true,
          hoverable: true,
          lastResort: 'right center',
          onShow: function resize() {
            resizePopup();
          },
        });
  });
});

Template.Semester_List.onDestroyed(function semesterListOnDestroyed() {
  // add your statement here
});

