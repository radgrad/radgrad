import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
import * as RouteNames from '/imports/startup/client/router.js';

// import { Logger } from 'meteor/jag:pince';
// const logger = new Logger('IN');

Template.Inspector.onCreated(function inspectorOnCreated() {
  // logger.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Inspector.onCreated`);
  this.state = this.data.dictionary;
});

Template.Inspector.helpers({
  course() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        return Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
      }
    return null;
  },
  courseDescription() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseDescription`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).description;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.description;
      }
    return null;
  },
  courseName() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseName`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).name;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.name;
      }
    return null;
  },
  courseNumber() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseNumber`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).number;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.number;
      }
    return null;
  },
  courseIce() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseIce`);
    // $('body').removeClass('waiting');
    if (Template.instance().state.get(plannerKeys.detailICE)) {
      const ice = Template.instance().state.get(plannerKeys.detailICE);
      // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} using detailICE {${ice.i}, ${ice.c}, ${ice.e}}`);
      return ice;
    }
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      const slug = Slugs.findDoc(course.slugID);
      const ice = makeCourseICE(slug.name, 'C');
      // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} using generic ice {${ice.i}, ${ice.c}, ${ice.e}}`);
      return ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
        const ice = ci.ice;
        // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} using ci ice {${ice.i}, ${ice.c}, ${ice.e}}`);
        return ice;
      }
    return null;
  },
  courseSlugID() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseSlugID`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailCourse).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return Slugs.getNameFromID(course.slugID);
      }
    return null;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courses100() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses100`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 1/ }).fetch();
    console.log(CourseInstances.find({}).count());
    const instances = CourseInstances.find({ note: /ICS 1/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      courseTakenIDs.push(ci.courseID);
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses200() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses200`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 2/ }).fetch();
    const instances = CourseInstances.find({ note: /ICS 2/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      courseTakenIDs.push(ci.courseID);
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses300() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses300`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 3/ }).fetch();
    const instances = CourseInstances.find({ note: /ICS 3/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      courseTakenIDs.push(ci.courseID);
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses410() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses410`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 4[0123]/ }).fetch();
    const instances = CourseInstances.find({ note: /ICS 4[0123]/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      courseTakenIDs.push(ci.courseID);
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses440() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses440`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 4[456]/ }).fetch();
    const instances = CourseInstances.find({ note: /ICS 4[456]/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      courseTakenIDs.push(ci.courseID);
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  futureInstance() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.getCurrentSemesterDoc().semesterNumber <= semester.semesterNumber;
    }
    return false;
  },
  courses470() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courses470`);
    let ret = [];
    const courses = Courses.find({ number: /ICS 4[789]/ }).fetch();
    const instances = CourseInstances.find({ note: /ICS 4[789]/ }).fetch();
    const courseTakenIDs = [];
    _.map(instances, (ci) => {
      if (ci.note !== 'ICS 499') {
        courseTakenIDs.push(ci.courseID);
      }
    });
    ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  getCourse() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} getCourse`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course;
      }
    return null;
  },
  getOpportunity() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} getOpportunity`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity);
      }
    return null;
  },
  hasCourse() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} hasCourse`);
    return Template.instance().state.get(plannerKeys.detailCourse) ||
        Template.instance().state.get(plannerKeys.detailCourseInstance);
  },
  hasOpportunity() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} hasOpportunity`);
    return Template.instance().state.get(plannerKeys.detailOpportunity) ||
        Template.instance().state.get(plannerKeys.detailOpportunityInstance);
  },
  hasRequest() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} hasRequest`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const instance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return VerificationRequests.find({ opportunityInstanceID: instance._id }).count() > 0;
    }
    return false;
  },
  instanceID() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} instanceID`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse)._id;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        return Template.instance().state.get(plannerKeys.detailCourseInstance)._id;
      } else
        if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
          return Template.instance().state.get(plannerKeys.detailOpportunity)._id;
        } else
          if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
            return Template.instance().state.get(plannerKeys.detailOpportunityInstance)._id;
          }
    return null;
  },
  instanceSemester() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} instanceSemester`);
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.toString(semester._id, false);
    }
    return null;
  },
  interests() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} interests`);
    const ret = [];
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      _.map(course.interestIDs, (iid) => {
        ret.push(Interests.findDoc(iid));
      });
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        _.map(course.interestIDs, (iid) => {
          ret.push(Interests.findDoc(iid));
        });
      } else
        if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
          _.map(Template.instance().state.get(plannerKeys.detailOpportunity).interestIDs, (iid) => {
            ret.push(Interests.findDoc(iid));
          });
        } else
          if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
            const opp = Opportunities.findDoc(Template.instance().state.get(
                plannerKeys.detailOpportunityInstance).opportunityID);
            _.map(opp.interestIDs, (iid) => {
              ret.push(Interests.findDoc(iid));
            });
          }
    return ret;
  },
  isInPlan() {
    return (Template.instance().state.get(plannerKeys.detailCourseInstance) ||
    Template.instance().state.get(plannerKeys.detailOpportunityInstance));
  },
  isPastInstance() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} isPastInstance`);
    const currentSemester = Semesters.getCurrentSemesterDoc();
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const ciSemester = Semesters.findDoc(ci.semesterID);
      return ciSemester.sortBy <= currentSemester.sortBy;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
        const studentID = getUserIdFromRoute();
        const requests = VerificationRequests.find({ opportunityInstanceID: oi._id, studentID }).fetch();
        const oppSemester = Semesters.findDoc(oi.semesterID);
        return !oi.verified && oppSemester.sortBy <= currentSemester.sortBy && requests.length === 0;
      }
    return false;
  },
  missingPrerequisite(prereqSlug) {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} missingPrerequisite`);
    const prereqID = Courses.findIdBySlug(prereqSlug);
    const studentID = getUserIdFromRoute();
    const courseInstances = CourseInstances.find({ studentID }).fetch();
    let ret = true;
    _.map(courseInstances, (ci) => {
      if (prereqID === ci.courseID) {
        ret = false;
      }
    });
    return ret;
  },
  passedCourse() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      if (ci.grade === 'A+' || ci.grade === 'A' || ci.grade === 'A-' ||
          ci.grade === 'B+' || ci.grade === 'B') {
        return true;
      }
    }
    return false;
  },
  opportunities() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunities`);
    let ret = [];
    const opportunities = Opportunities.find().fetch();
    const currentSemesterID = Semesters.getCurrentSemester();
    ret = _.filter(opportunities, function filter(o) {
      return _.indexOf(o.semesterIDs, currentSemesterID) !== -1;
    });
    return ret;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunityDescription() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunityDescription`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp.description;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).description;
      }
    return null;
  },
  opportunityIce() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunityIce`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).ice;
      }
    return null;
  },
  opportunityMore() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunityMore`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).moreInformation;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).moreInformation;
      }
    return null;
  },
  opportunityName() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunityName`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp.name;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).name;
      }
    return null;
  },
  opportunitySemester() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunitySemester`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const semester = OpportunityInstances.getSemesterDoc(oi._id);
      return `${semester.term} ${semester.year}`;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        const opportunity = Template.instance().state.get(plannerKeys.detailOpportunity);
        let semesterStr = '';
        opportunity.semesterIDs.forEach((sem) => {
          semesterStr += Semesters.toString(sem, false);
          semesterStr += ', ';
        });
        return semesterStr.substring(0, semesterStr.length - 2);
      }
    return null;
  },
  opportunitySlugID() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} opportunitySlugID`);
    if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailOpportunity).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
        const opp = Opportunities.findDoc({ _id: oi.opportunityID });
        return Slugs.getNameFromID(opp.slugID);
      }
    return null;
  },
  prerequisites() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} prerequisites`);
    const ret = [];
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      _.map(Template.instance().state.get(plannerKeys.detailCourse).prerequisites, (pre) => {
        ret.push(pre);
      });
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        _.map(course.prerequisites, (pre) => {
          ret.push(pre);
        });
      }
    return ret;
  },
  requestHistory() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} requestHistory`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        return request[0].processed;
      }
    }
    return '';
  },
  requestStatus() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} requestStatus`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        return request[0].status;
      }
    }
    return '';
  },
  requestWhenSubmitted() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} requestWhenSubmitted`);
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        const submitted = moment(request[0].submittedOn);
        return submitted.calendar();
      }
    }
    return '';
  },
});

Template.Inspector.events({
  'click .course.item': function clickCourseItem(event) {
    event.preventDefault();
    const courseArr = Courses.find({ _id: event.target.id }).fetch();
    if (courseArr.length > 0) {
      Template.instance().state.set(plannerKeys.detailCourse, courseArr[0]);
      Template.instance().state.set(plannerKeys.detailCourseInstance, null);
      Template.instance().state.set(plannerKeys.detailOpportunity, null);
      Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
    }
  },
  'click .opportunity.item': function clickOpportunityItem(event) {
    event.preventDefault();
    const template = Template.instance();
    const opportunityArr = Opportunities.find({ _id: event.target.id }).fetch();
    if (opportunityArr.length > 0) {
      template.state.set(plannerKeys.detailCourse, null);
      template.state.set(plannerKeys.detailCourseInstance, null);
      template.state.set(plannerKeys.detailOpportunity, opportunityArr[0]);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    }
  },
  'click button.verifyInstance': function clickButtonVerifyInstance(event) {
    event.preventDefault();
    const id = event.target.id;
    const opportunityInstance = id;
    const student = getRouteUserName();
    VerificationRequests.define({ student, opportunityInstance });
  },
});

Template.Inspector.onRendered(function inspectorOnRendered() {
  // logger.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Inspector.onRendered`);
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});
