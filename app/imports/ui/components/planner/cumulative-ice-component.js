import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';

const logger = new Logger('IC');

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
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.earnedC ${year}`);
    return getCumulativeEarnedIce(year).c;
  },
  earnedE(year) {
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.earnedE ${year}`);
    return getCumulativeEarnedIce(year).e;
  },
  earnedI(year) {
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.earnedI ${year}`);
    return getCumulativeEarnedIce(year).i;
  },
  projectedC(year) {
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.projectedC ${year}`);
    return getCumulativeProjectedIce(year).c;
  },
  projectedE(year) {
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.projectedE ${year}`);
    return getCumulativeProjectedIce(year).e;
  },
  projectedI(year) {
    logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Cumulative_Ice_Component.projectedI ${year}`);
    return getCumulativeProjectedIce(year).i;
  },
});
