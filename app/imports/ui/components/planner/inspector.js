import { Template } from 'meteor/templating';

import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { getTotalICE, makeCourseICE, getPlanningICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';

Template.Inspector.helpers({
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses100() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 1')) {
        return false;
      }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses200() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 2')) {
        return false;
      }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses300() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 3')) {
        return false;
      }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses410() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 41') && !c.number.startsWith('ICS 42') && !c.number.startsWith('ICS 43')) {
          return false;
        }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses440() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 44') && !c.number.startsWith('ICS 45') && !c.number.startsWith('ICS 46')) {
          return false;
        }
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses470() {
    let ret = [];
    const courses = Courses.find().fetch();
    const studentID = getUserIdFromRoute();
    const instances = CourseInstances.find({ studentID }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = _.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 47') && !c.number.startsWith('ICS 48') && !c.number.startsWith('ICS 49')) {
          return false;
        }
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
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      const slug = Slugs.findDoc(course.slugID);
      const ice = makeCourseICE(slug.name, '***');
      return ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
        const course = Courses.findDoc(ci.courseID);
        const slug = Slugs.findDoc(course.slugID);
        const ice = makeCourseICE(slug.name, ci.grade);
        console.log(moment().format('YYYY-MM-DDTHH:mm:ss.SSS'), 'courseIce', ice, ci.grade);
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
  fallArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year,
        term: Semesters.FALL,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  getDictionary() {
    return Template.instance().state;
  },
  hasCourse() {
    return Template.instance().state.get(plannerKeys.detailCourse) ||
        Template.instance().state.get(plannerKeys.detailCourseInstance);
  },
  hasMoreYears() {
    const studentID = getUserIdFromRoute();
    const ays = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ays.length > 3;
  },
  hasNextYear() {
    const instance = Template.instance();
    const studentID = getUserIdFromRoute();
    const ays = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ays[ays.length - 1].year > instance.state.get('startYear');
  },
  hasOpportunity() {
    return Template.instance().state.get(plannerKeys.detailOpportunity) ||
        Template.instance().state.get(plannerKeys.detailOpportunityInstance);
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
  hasPrevYear() {
    const instance = Template.instance();
    const studentID = getUserIdFromRoute();
    const ays = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ays[0].year < instance.state.get('startYear') - 3;
  },
  hasRequest() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const instance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return VerificationRequests.find({ opportunityInstanceID: instance._id }).count() > 0;
    }
    return false;
  },
  instanceID() {
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
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const semester = Semesters.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).semesterID);
      return Semesters.toString(semester._id, false);
    }
    return '';
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
  isDeletableInstance() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      return !ci.verified;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const opportunity = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
        return !opportunity.verified;
      }
    return false;
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
  isFuture(year) {
    return year.year >= moment().year();
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
      return Template.instance().state.get(plannerKeys.detailOpportunityInstance).description;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunityInstance).description;
      }
    return null;
  },
  opportunitySemester() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const semester = OpportunityInstances.getSemesterDoc(
          Template.instance().state.get(plannerKeys.detailOpportunityInstance)._id);
      return Semesters.toString(semester.id, false);
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
      return Template.instance().state.get(plannerKeys.detailOpportunityInstance).name;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunityInstance).name;
      }
    return null;
  },
  opportunityIce() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunityInstance).ice;
      }
    return null;
  },
  opportunityStart() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).startActive.toDateString();
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunityInstance).startActive.toDateString();
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
    return null;
  },
  processedDate(date) {
    const processed = moment(date);
    return processed.calendar();
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
  springArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  summerArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SUMMER,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  yearICE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    const studentID = getUserIdFromRoute();
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({ studentID, semesterID: sem }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({ studentID, semesterID: sem }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis);
  },
  yearPlanningICE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    const studentID = getUserIdFromRoute();
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({ studentID, semesterID: sem }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({ studentID, semesterID: sem }).fetch();
      cis = cis.concat(oi);
    });
    return getPlanningICE(cis);
  },
  years() {
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    const instance = Template.instance();
    if (ay.length > 0 && !instance.state.get('startYear')) {
      instance.state.set('startYear', ay[ay.length - 1].year);
    }
    const ret = _.filter(ay, function filter(academicYear) {
      const year = academicYear.year;
      if (year >= instance.state.get('startYear') - 3 && year <= instance.state.get('startYear')) {
        return true;
      }
      return false;
    });
    return ret;
  },
});

Template.Inspector.events({
  'click button.delInstance': function clickButtonDelInstance(event) {
    event.preventDefault();
    const id = event.target.id;
    try {
      const ci = CourseInstances.findDoc(id);
      CourseInstances.removeIt(ci._id);
    } catch (e) {
      try {
        const op = OpportunityInstances.findDoc(id);
        OpportunityInstances.removeIt(op._id);
      } catch (e1) {
        // What do we do here?
      }
    }
    Template.instance().state.set('detailCourseID', null);
    Template.instance().state.set('detailOpportunityID', null);
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
});

Template.Inspector.onRendered(function inspectorOnRendered() {
  // add your statement here
});

Template.Inspector.onDestroyed(function inspectorOnDestroyed() {
  // add your statement here
});

