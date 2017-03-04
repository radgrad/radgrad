import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

function getCumulativeIceInstances(year) {
  const studentID = getUserIdFromRoute();
  const ays = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
  const years = _.filter(ays, function filter(academicYear) {
    const ayYear = academicYear.year;
    return ayYear <= year.year;
  });
  let instances = [];
  _.map(years, function findInstances(ay) {
    const semesterIDs = ay.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      instances = instances.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      instances = instances.concat(oi);
    });
  });
  return instances;
}

function getCumulativeEarnedIce(year) {
  return getTotalICE(getCumulativeIceInstances(year));
}

function getCumulativeProjectedIce(year) {
  return getPlanningICE(getCumulativeIceInstances(year));
}

Template.Cumulative_Ice_Component.helpers({
  earnedC(year) {
    return getCumulativeEarnedIce(year).c;
  },
  earnedE(year) {
    return getCumulativeEarnedIce(year).e;
  },
  earnedI(year) {
    return getCumulativeEarnedIce(year).i;
  },
  projectedC(year) {
    return getCumulativeProjectedIce(year).c;
  },
  projectedE(year) {
    return getCumulativeProjectedIce(year).e;
  },
  projectedI(year) {
    return getCumulativeProjectedIce(year).i;
  },
});

Template.Cumulative_Ice_Component.events({
  // add your events here
});

Template.Cumulative_Ice_Component.onCreated(function cumulativeIceComponentOnCreated() {
  this.subscribe(AcademicYearInstances.getPublicationName(1), getUserIdFromRoute());
  this.subscribe(CourseInstances.getPublicationName(5), getUserIdFromRoute());
  this.subscribe(OpportunityInstances.getPublicationName(3), getUserIdFromRoute());
});

Template.Cumulative_Ice_Component.onRendered(function cumulativeIceComponentOnRendered() {
  // add your statement here
});

Template.Cumulative_Ice_Component.onDestroyed(function cumulativeIceComponentOnDestroyed() {
  // add your statement here
});

