import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection.js';
import { academicYearInstancesDefineMethod } from '../../../api/degree-plan/AcademicPlanCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';

// /** @module ui/components/planner/Academic_Plan */

export const plannerKeys = {
  detailCourse: 'detailCourse',
  detailCourseInstance: 'detailCourseInstance',
  detailOpportunity: 'detailOpportunity',
  detailOpportunityInstance: 'detailOpportunityInstance',
  detailICE: 'detailICE',
};

Template.Academic_Plan.onCreated(function academicPlanOnCreated() {
  this.state = new ReactiveDict();
  this.startYearIndex = new ReactiveVar();
});

Template.Academic_Plan.helpers({
  cumIceArgs(year) {
    return { year };
  },
  fallID(year) {
    return `fall${year.year}`;
  },
  fallArgs(year) {
    if (Template.instance().data.currentSemester) {
      const currentSemester = Template.instance().data.currentSemester;
      const semesterID = year.semesterIDs[0];
      const semester = Semesters.findDoc(semesterID);
      const isFuture = true;
      const isCurrentSemester = semester.semesterNumber === currentSemester.semesterNumber;
      const semesterName = 'Fall';
      const yearArg = year.year;
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
    return `Academic Year ${year}-${year + 1}`;
  },
  hasNextYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return instance.startYearIndex.get() < ays.length - 4;
    }
    return false;
  },
  hasPrevYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return instance.startYearIndex.get() > 0;
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
  pastFallArgs(year) {  // TODO change to many helpers instead.
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Fall';
    const yearArg = year.year;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  pastSpringArgs(year) {  // TODO change to many helpers instead.
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Spring';
    const yearArg = year.year + 1;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  pastSummerArgs(year) {  // TODO change to many helpers instead.
    const icsCourses = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    const semesterName = 'Summer';
    const yearArg = year.year + 1;
    return { icsCourses, semesterOpportunities, semesterName, dictionary: Template.instance().state, year: yearArg };
  },
  springArgs(year) {  // TODO change to many helpers
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
  summerArgs(year) {  // TODO change to many helpers
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
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    // We always want to show 4 AYs.
    const instance = Template.instance();
    if (ay.length > 0 && typeof instance.startYearIndex.get() === 'undefined') {
      const currentSemID = Semesters.getCurrentSemester();
      let currentAyIndex = -1;
      let index = 0;
      _.forEach(ay, (aYear) => {
        if (_.indexOf(aYear.semesterIDs, currentSemID) !== -1) {
          currentAyIndex = index;
        }
        index += 1;
      });
      if (currentAyIndex !== -1) {
        if (currentAyIndex > 0 && currentAyIndex < ay.length - 4) {
          instance.startYearIndex.set(currentAyIndex - 1);
        } else
          if (currentAyIndex > 0 && currentAyIndex >= ay.length - 4) {
            instance.startYearIndex.set(ay.length - 4);
          } else {
            instance.startYearIndex.set(0);
          }
      } else {
        instance.startYearIndex.set(0);
      }
    }
    const ret = _.filter(ay, function filter(academicYear) {
      const index = _.indexOf(ay, academicYear);
      const yearIndex = instance.startYearIndex.get();
      if (index < yearIndex) {
        // startIndex is 0 just show 0 - 3
        // show startIndex -1 through startIndex + 2
        // show len - 4 throug len - 1
        return false;
      }
      if (index > yearIndex + 3) {
        return false;
      }
      return true;
    });
    return ret;
  },
});

Template.Academic_Plan.events({
  'click #addAY': function clickAddAY(event) {
    event.preventDefault();
    const studentID = getUserIdFromRoute();
    const student = getRouteUserName();
    const ays = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    let year = moment().year();
    if (ays.length > 0) {
      const ay = ays[ays.length - 1];
      year = ay.year + 1;
    }
    academicYearInstancesDefineMethod.call({ year, student });
  },
  'click #nextYear': function clickNextYear(event) {
    event.preventDefault();
    const year = Template.instance().startYearIndex.get();
    Template.instance().startYearIndex.set(year + 1);
  },
  'click #prevYear': function clickPrevYear(event) {
    event.preventDefault();
    const year = Template.instance().startYearIndex.get();
    Template.instance().startYearIndex.set(year - 1);
  },
});

Template.Academic_Plan.onRendered(function academicPlanOnRendered() {
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});
