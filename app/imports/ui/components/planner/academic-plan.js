import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';

export const plannerKeys = {
  detailsCourse: 'detailsCourse',
  detailsOpportunity: 'detailsOpportunity',
  detailsICE: 'detailsICE',
  selectedOpportunities: 'opportunities',
  selectedCourses: 'courses',
  selectedPlans: 'academicPlans',
  selectedDetails: 'details',
};

export function selectFavoriteOpportunitiesTab(state) {
  state.set(plannerKeys.selectedOpportunities, true);
  state.set(plannerKeys.selectedCourses, false);
  state.set(plannerKeys.selectedPlans, false);
  state.set(plannerKeys.selectedDetails, false);
}

export function selectFavoriteAcademicPlansTab(state) {
  state.set(plannerKeys.selectedOpportunities, false);
  state.set(plannerKeys.selectedCourses, false);
  state.set(plannerKeys.selectedPlans, true);
  state.set(plannerKeys.selectedDetails, false);
}

export function selectFavoriteCoursesTab(state) {
  state.set(plannerKeys.selectedOpportunities, false);
  state.set(plannerKeys.selectedCourses, true);
  state.set(plannerKeys.selectedPlans, false);
  state.set(plannerKeys.selectedDetails, false);
}

export function selectDetailsTab(state) {
  state.set(plannerKeys.selectedOpportunities, false);
  state.set(plannerKeys.selectedCourses, false);
  state.set(plannerKeys.selectedPlans, false);
  state.set(plannerKeys.selectedDetails, true);
}

export function showCourseDetails(state, courseInstance) {
  // console.log('showCourseDetails', courseInstance);
  state.set(plannerKeys.detailsCourse, courseInstance);
  state.set(plannerKeys.detailsOpportunity, null);
  state.set(plannerKeys.detailsICE, courseInstance.ice);
  selectDetailsTab(state);
}

export function showOpportunityDetails(state, opportunityInstance) {
  // console.log('showOpportunityDetails', opportunityInstance);
  state.set(plannerKeys.detailsCourse, null);
  state.set(plannerKeys.detailsOpportunity, opportunityInstance);
  state.set(plannerKeys.detailsICE, opportunityInstance.ice);
  selectDetailsTab(state);
}

Template.Academic_Plan.onCreated(function academicPlanOnCreated() {
  this.state = new ReactiveDict();
  selectFavoriteOpportunitiesTab(this.state);
  this.startYearIndex = new ReactiveVar();
});

Template.Academic_Plan.helpers({
  currentSemester() {
    return Template.instance().data.currentSemester;
  },
  fallSemester(year) {
    return Semesters.findDoc(year.semesterIDs[0]);
  },
  springSemester(year) {
    return Semesters.findDoc(year.semesterIDs[1]);
  },
  summerSemester(year) {
    return Semesters.findDoc(year.semesterIDs[2]);
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
  icsCoursesFall(year) {
    return CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
  },
  icsCoursesSpring(year) {
    return CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
  },
  icsCoursesSummer(year) {
    return CourseInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
  },
  isCurrentSemesterFall(year) {
    const semester = Semesters.findDoc(year.semesterIDs[0]);
    return semester.semesterNumber === Template.instance().data.currentSemester.semesterNumber;
  },
  isCurrentSemesterSpring(year) {
    const semester = Semesters.findDoc(year.semesterIDs[1]);
    return semester.semesterNumber === Template.instance().data.currentSemester.semesterNumber;
  },
  isCurrentSemesterSummer(year) {
    const semester = Semesters.findDoc(year.semesterIDs[2]);
    return semester.semesterNumber === Template.instance().data.currentSemester.semesterNumber;
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
  opportunitiesFall(year) {
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[0],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    return semesterOpportunities;
  },
  opportunitiesSpring(year) {
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[1],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    return semesterOpportunities;
  },
  opportunitiesSummer(year) {
    const semesterOpportunities = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      semesterID: year.semesterIDs[2],
    }).fetch();
    _.forEach(semesterOpportunities, (opp) => {
      opp.name = Opportunities.findDoc(opp.opportunityID).name;  // eslint-disable-line
    });
    return semesterOpportunities;
  },
  springYear(year) {
    return year.year + 1;
  },
  years() {
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    // We always want to show 4 AYs.
    const instance = Template.instance();
    if (ay.length > 0 && typeof instance.startYearIndex.get() === 'undefined') {
      const currentSemID = Semesters.getCurrentSemesterID();
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
    defineMethod.call({ collectionName: AcademicYearInstances.getCollectionName(), definitionData: { year, student } });
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
