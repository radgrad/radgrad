import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ReactiveDict } from 'meteor/reactive-dict';
import { upComingSemesters } from '../../../api/semester/SemesterUtilities';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Courses } from '../../../api/course/CourseCollection';

Template.Course_Score_Board_Widget.onCreated(function courseScoreBoardWidgetOnCreated() {
  this.dictionary = new ReactiveDict();
  this.dictionary.set('byICS', true);
  this.dictionary.set('byEE', true);
  this.dictionary.set('by1xx', true);
  this.dictionary.set('by2xx', true);
  this.dictionary.set('by3xx', true);
  this.dictionary.set('by4xx', true);
  this.semesters = upComingSemesters();
});

Template.Course_Score_Board_Widget.helpers({
  getDictionary() {
    return Template.instance().dictionary;
  },
  courses() {
    let courses = Courses.findNonRetired({}, { sort: { number: 1 } });
    courses = _.filter(courses, function (c) {
      let retVal = false;
      if (Template.instance().dictionary.get('byICS')) {
        if (c.number.startsWith('ICS')) {
          retVal = true;
        }
      }
      if (Template.instance().dictionary.get('byEE')) {
        if (c.number.startsWith('EE')
          || c.number.startsWith('CEE')
          || c.number.startsWith('ME')
          || c.number.startsWith('OE')
          || c.number.startsWith('BE')) {
          retVal = true;
        }
      }
      return retVal;
    });
    courses = _.filter(courses, function (c) {
      let retVal = false;
      if (Template.instance().dictionary.get('by1xx')) {
        const regex = new RegExp('1[0-9][0-9]');
        if (regex.test(c.number)) {
          retVal = true;
        }
      }
      if (Template.instance().dictionary.get('by2xx')) {
        const regex = new RegExp('2[0-9][0-9]');
        if (regex.test(c.number)) {
          retVal = true;
        }
      }
      if (Template.instance().dictionary.get('by3xx')) {
        const regex = new RegExp('3[0-9][0-9]');
        if (regex.test(c.number)) {
          retVal = true;
        }
      }
      if (Template.instance().dictionary.get('by4xx')) {
        const regex = new RegExp('4[0-9][0-9]');
        if (regex.test(c.number)) {
          retVal = true;
        }
      }
      return retVal;
    });
    // console.log('done courses');
    return courses;
  },
  semesterName(semester) {
    // console.log('semesterName');
    return Semesters.getShortName(semester);
  },
  upcomingSemesters() {
    // console.log('upcomingSemesters');
    return Template.instance().semesters;
  },
});
