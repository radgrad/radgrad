/* global window */

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

// comment out next line to silence AP logger
// Logger.setLevel('AP', 'trace');
const ap = new Logger('AP');

export const plannerKeys = {
  detailCourse: 'detailCourse',
  detailCourseInstance: 'detailCourseInstance',
  detailOpportunity: 'detailOpportunity',
  detailOpportunityInstance: 'detailOpportunityInstance',
  detailICE: 'detailICE',
};

Template.Academic_Plan.onCreated(function academicPlanOnCreated() {
  this.state = new ReactiveDict();
  this.startYear = new ReactiveVar();
});

Template.Academic_Plan.helpers({
  fallArgs(year) {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start fallArgs ${year.year}`);
    if (Template.instance().data.currentSemesterID) {
      const currentSemesterID = Template.instance().data.currentSemesterID;
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year,
        term: Semesters.FALL,
      });
      const semester = Semesters.findDoc(semesterID);
      const isFuture = semester.semesterNumber >= currentSemester.semesterNumber;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      return { currentSemester, semester, dictionary: Template.instance().state, isFuture, isCurrentSemester };
    }
    return null;
  },
  getDictionary() {
    return Template.instance().state;
  },
  getAcademicYear(year) {
    return `Academic Year ${year}-${year + 1}`;
  },
  hasNextYear() {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start hasNextYear`);
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return ays[ays.length - 1].year > instance.startYear.get();
    }
    return false;
  },
  hasPrevYear() {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start hasPrevYear`);
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return ays[0].year < instance.startYear.get() - 3;
    }
    return false;
  },
  springArgs(year) {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start springArgs ${year.year}`);
    if (Template.instance().data.currentSemesterID) {
      const currentSemesterID = Template.instance().data.currentSemesterID;
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      const isFuture = semester.semesterNumber >= currentSemester.semesterNumber;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      return { currentSemester, semester, dictionary: Template.instance().state, isFuture, isCurrentSemester };
    }
    return null;
  },
  summerArgs(year) {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start summerArgs ${year.year}`);
    if (Template.instance().data.currentSemesterID) {
      const currentSemesterID = Template.instance().data.currentSemesterID;
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SUMMER,
      });
      const semester = Semesters.findDoc(semesterID);
      const isFuture = semester.semesterNumber >= currentSemester.semesterNumber;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      return { currentSemester, semester, dictionary: Template.instance().state, isFuture, isCurrentSemester };
    }
    return null;
  },
  years() {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start years`);
    // window.camDebugging.start('ap.years');
    // debugger
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    const instance = Template.instance();
    if (ay.length > 0 && !instance.startYear.get()) {
      instance.startYear.set(ay[ay.length - 1].year);  // TODO: Do we want to show the future or the past?
    }
    const ret = lodash.filter(ay, function filter(academicYear) {
      const year = academicYear.year;
      if (year >= instance.startYear.get() - 3 && year <= instance.startYear.get()) {
        return true;
      }
      return false;
    });
    // window.camDebugging.stop('ap.years');
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} years ${ret}`);
    return ret;
  },
});

Template.Academic_Plan.events({
  'click #addAY': function clickAddAY(event) {
    event.preventDefault();
    const student = getUserIdFromRoute();
    const ays = AcademicYearInstances.find({ studentID: student }, { sort: { year: 1 } }).fetch();
    let year = moment().year();
    if (ays.length > 0) {
      const ay = ays[ays.length - 1];
      year = ay.year + 1;
    }
    AcademicYearInstances.define({ year, student });
  },
  'click #nextYear': function clickNextYear(event) {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click nextYear`);
    // window.camDebugging.start('click nextYear');
    event.preventDefault();
    const year = Template.instance().startYear.get();
    Template.instance().startYear.set(year + 1);
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Done: click nextYear`);
    // window.camDebugging.stop('click nextYear');
  },
  'click #prevYear': function clickPrevYear(event) {
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click prevYear`);
    // window.camDebugging.start('click prevYear');
    event.preventDefault();
    const year = Template.instance().startYear.get();
    Template.instance().startYear.set(year - 1);
    ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click prevYear`);
    // window.camDebugging.stop('click prevYear');
  },
});

Template.Academic_Plan.onRendered(function academicPlanOnRendered() {
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});
