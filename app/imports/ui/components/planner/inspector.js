import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
// import { Logger } from 'meteor/jag:pince';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Inspector.helpers({
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  courses100() {
    let ret = [];
    const courses = Courses.find({ number: /ICS 1/ }).fetch();
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
  courses470() {
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
  courseDescription() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).description;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.description;
      }
    return null;
  },
  courseIce() {
    // const logger = new Logger('inspector.courseIce');
    // $('body').removeClass('waiting');
    if (Template.instance().state.get(plannerKeys.detailICE)) {
      const ice = Template.instance().state.get(plannerKeys.detailICE);
      // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} using detailICE {${ice.i}, ${ice.c}, ${ice.e}}`);
      return ice;
    }
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      const slug = Slugs.findDoc(course.slugID);
      const ice = makeCourseICE(slug.name, 'C');
      // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} using generic ice {${ice.i}, ${ice.c}, ${ice.e}}`);
      return ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
        const ice = ci.ice;
        // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} using ci ice {${ice.i}, ${ice.c}, ${ice.e}}`);
        return ice;
      }
    return null;
  },
  courseName() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).name;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.name;
      }
    return null;
  },
  courseSlugID() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailCourse).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return Slugs.getNameFromID(course.slugID);
      }
    return null;
  },
  courseNumber() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).number;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.number;
      }
    return null;
  },
  hasCourse() {
    return Template.instance().state.get(plannerKeys.detailCourse) ||
        Template.instance().state.get(plannerKeys.detailCourseInstance);
  },
  hasOpportunity() {
    return Template.instance().state.get(plannerKeys.detailOpportunity) ||
        Template.instance().state.get(plannerKeys.detailOpportunityInstance);
  },
  opportunitySlugID() {
    if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailOpportunity).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailOpportunityInstance).courseID);
        return Slugs.getNameFromID(course.slugID);
      }
    return null;
  },
  hasRequest() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const instance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return VerificationRequests.find({ opportunityInstanceID: instance._id }).count() > 0;
    }
    return false;
  },
  instanceSemester() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.toString(semester._id, false);
    }
    return null;
  },
  interests() {
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
  interestName(interestSlugName) {
    return Slugs.getNameFromID(interestSlugName);
  },
  isPastInstance() {
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
  opportunities() {
    let ret = [];
    const opportunities = Opportunities.find().fetch();
    const currentSemesterID = Semesters.getCurrentSemester();
    ret = _.filter(opportunities, function filter(o) {
      return _.indexOf(o.semesterIDs, currentSemesterID) !== -1;
    });
    return ret;
  },
  opportunityDescription() {
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
  opportunitySemester() {
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
  opportunityName() {
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
  opportunityIce() {
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
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).moreInformation;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).moreInformation;
      }
    return null;
  },
  prerequisites() {
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
    const studentID = getUserIdFromRoute();
    const student = Users.findDoc(studentID).username;
    VerificationRequests.define({ student, opportunityInstance });
  },
});

Template.Inspector.onCreated(function inspectorOnCreated() {
  this.state = this.data.dictionary;
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Inspector.onRendered(function inspectorOnRendered() {
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});

Template.Inspector.onDestroyed(function inspectorOnDestroyed() {
  // add your statement here
});

