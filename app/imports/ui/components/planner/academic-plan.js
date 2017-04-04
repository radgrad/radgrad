/* global window document */

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

// import { Logger } from 'meteor/jag:pince';
// const ap = new Logger('AP');

export const plannerKeys = {
  detailCourse: 'detailCourse',
  detailCourseInstance: 'detailCourseInstance',
  detailOpportunity: 'detailOpportunity',
  detailOpportunityInstance: 'detailOpportunityInstance',
  detailICE: 'detailICE',
};

Template.Academic_Plan.onCreated(function academicPlanOnCreated() {
  // ap.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Academic_Plan.onCreated`);
  this.state = new ReactiveDict();
  this.startYearIndex = new ReactiveVar();
  // document.getElementsByTagName('body')[0].style.cursor = 'progress';
});

Template.Academic_Plan.helpers({
  cumIceArgs(year) {
    return { year };
  },
  fallID(year) {
    return `fall${year.year}`;
  },
  fallArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start fallArgs ${year.year}`);
    if (Template.instance().data.currentSemester) {
      const currentSemester = Template.instance().data.currentSemester;
      const semesterID = year.semesterIDs[0];
      const semester = Semesters.findDoc(semesterID);
      const isFuture = true;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      const semesterName = 'Fall';
      const yearArg = year.year;
      // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end fallArgs ${year.year}`);
      return {
        currentSemester,
        semester,
        dictionary: Template.instance().state,
        isFuture,
        isCurrentSemester,
        semesterName,
        year: yearArg,
      };
    }
    return null;
  },
  getDictionary() {
    return Template.instance().state;
  },
  getAcademicYear(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} getAcademicYear ${year}`);
    return `Academic Year ${year}-${year + 1}`;
  },
  hasNextYear() {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start hasNextYear`);
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end hasNextYear`);
      return instance.startYearIndex.get() < ays.length - 4;
    }
    return false;
  },
  hasPrevYear() {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start hasPrevYear`);
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      console.log('hasPrev', ays.length, instance.startYearIndex.get());
      // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end hasPrevYear`);
      return instance.startYearIndex.get() - 3 >= 0;
    }
    return false;
  },
  isPastFall(year) {
    const semester = Semesters.findDoc(year.semesterIDs[0]);
    return semester.semesterNumber < Template.instance().data.currentSemester.semesterNumber;
  },
  isPastSpring(year) {
    const semester = Semesters.findDoc(year.semesterIDs[1]);
    return semester.semesterNumber < Template.instance().data.currentSemester.semesterNumber;
  },
  isPastSummer(year) {
    const semester = Semesters.findDoc(year.semesterIDs[2]);
    return semester.semesterNumber < Template.instance().data.currentSemester.semesterNumber;
  },
  pastFallArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} pastFallArgs ${year.year}`);
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
    _.map(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Fall';
    const yearArg = year.year;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  pastSpringArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} pastSpringArgs ${year.year}`);
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
    _.map(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Spring';
    const yearArg = year.year;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  pastSummerArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} pastSpringArgs ${year.year}`);
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
    _.map(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Summer';
    const yearArg = year.year;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  springArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start springArgs ${year.year}`);
    if (Template.instance().data.currentSemester) {
      const currentSemester = Template.instance().data.currentSemester;
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      const isFuture = semester.semesterNumber >= currentSemester.semesterNumber;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      const semesterName = 'Spring';
      const yearArg = year.year;
      // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end springArgs ${year.year}`);
      return {
        currentSemester,
        semester,
        dictionary: Template.instance().state,
        isFuture,
        isCurrentSemester,
        semesterName,
        year: yearArg,
      };
    }
    return null;
  },
  springID(year) {
    return `spring${year.year}`;
  },
  summerArgs(year) {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start summerArgs ${year.year}`);
    if (Template.instance().data.currentSemester) {
      const currentSemester = Template.instance().data.currentSemester;
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SUMMER,
      });
      const semester = Semesters.findDoc(semesterID);
      const isFuture = semester.semesterNumber >= currentSemester.semesterNumber;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      const semesterName = 'Summer';
      const yearArg = year.year;
      // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end summerArgs ${year.year}`);
      return {
        currentSemester,
        semester,
        dictionary: Template.instance().state,
        isFuture,
        isCurrentSemester,
        semesterName,
        year: yearArg,
      };
    }
    return null;
  },
  summerID(year) {
    return `summer${year.year}`;
  },
  years() {
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} start years`);
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    // We always want to show 4 AYs.
    const instance = Template.instance();
    if (ay.length > 0 && !instance.startYearIndex.get()) {
      const currentSemID = Semesters.getCurrentSemester();
      let currentAyIndex = -1;
      let index = 0;
      _.map(ay, (aYear) => {
        if (_.indexOf(aYear.semesterIDs, currentSemID) !== -1) {
          currentAyIndex = index;
        }
        index += 1;
      });
      if (currentAyIndex !== -1) {
        instance.startYearIndex.set(ay.length - (ay.length - currentAyIndex));
      } else {
        console.log('no current semester');
        instance.startYearIndex.set(0);
      }
    }
    const ret = _.filter(ay, function filter(academicYear) {
      const index = _.indexOf(ay, academicYear);
      const yearIndex = instance.startYearIndex.get();
      // startIndex is 0 just show 0 - 3
      // show startIndex -1 through startIndex + 2
      // show len - 4 throug len - 1
      const diff = index - yearIndex;
      console.log(index, yearIndex, diff, (ay.length - yearIndex));
      if (yearIndex === 0) {
        console.log('just starting');
        if (diff < 4) {
          return true;
        }
        return false;
      } else
        if ((ay.length - yearIndex) < 4) {
          console.log('at end');
          if (index < ay.length - 4) {
            return false;
          }
          return true;
        } else
          if (diff >= -1 && diff <= 2) {
            console.log(diff, index, instance.startYearIndex.get(), 'true');
            return true;
          } else {
            console.log(diff, index, instance.startYearIndex.get(), 'false');
            return false;
          }
    });
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} end years ${ret.length}`);
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
    // ap.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click nextYear`);
    // window.camDebugging.start('click nextYear');
    event.preventDefault();
    const year = Template.instance().startYearIndex.get();
    Template.instance().startYearIndex.set(year + 1);
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Done: click nextYear`);
    // window.camDebugging.stop('click nextYear');
  },
  'click #prevYear': function clickPrevYear(event) {
    // ap.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click prevYear`);
    // window.camDebugging.start('click prevYear');
    event.preventDefault();
    const year = Template.instance().startYearIndex.get();
    Template.instance().startYearIndex.set(year - 1);
    // ap.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} click prevYear`);
    // window.camDebugging.stop('click prevYear');
  },
});

Template.Academic_Plan.onRendered(function academicPlanOnRendered() {
  // ap.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Academic_Plan.onRendered`);
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});
