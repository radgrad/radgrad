// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { getTotalICE, makeCourseICE, getPlanningICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

export const plannerKeys = {
  detailCourse: 'detailCourse',
  detailCourseInstance: 'detailCourseInstance',
  detailOpportunity: 'detailOpportunity',
  detailOpportunityInstance: 'detailOpportunityInstance',
  detailICE: 'detailICE',
};

Template.Academic_Plan_2.helpers({
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses100() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 1')) {
        return false;
      }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses200() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 2')) {
        return false;
      }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses300() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 3')) {
        return false;
      }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses410() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 41') && !c.number.startsWith('ICS 42') && !c.number.startsWith('ICS 43')) {
          return false;
        }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses440() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 44') && !c.number.startsWith('ICS 45') && !c.number.startsWith('ICS 46')) {
          return false;
        }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courses470() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      if (!c.number.startsWith('ICS 4')) {
        return false;
      } else
        if (!c.number.startsWith('ICS 47') && !c.number.startsWith('ICS 48') && !c.number.startsWith('ICS 49')) {
          return false;
        }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  courseDescription() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      if (CourseInstances.isDefined(id)) {
        const ci = CourseInstances.findDoc(Template.instance().state.get('detailCourseID'));
        const course = Courses.findDoc(ci.courseID);
        return course.description;
      }
      const course = Courses.findDoc(id);
      return course.description;
    }
    return null;
  },
  courseIce() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      if (CourseInstances.isDefined(id)) {
        const ci = CourseInstances.findDoc(Template.instance().state.get('detailCourseID'));
        const course = Courses.findDoc(ci.courseID);
        const slug = Slugs.findDoc(course.slugID);
        const ice = makeCourseICE(slug.name, ci.grade);
        // console.log(ice);
        return ice;
      }
      const course = Courses.findDoc(id);
      const slug = Slugs.findDoc(course.slugID);
      const ice = makeCourseICE(slug.name, '***');
      return ice;
    }
    return null;
  },
  courseName() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      if (CourseInstances.isDefined(id)) {
        const ci = CourseInstances.findDoc(id);
        const course = Courses.findDoc(ci.courseID);
        return course.name;
      }
      const course = Courses.findDoc(id);
      return course.name;
    }
    return null;
  },
  courseNumber() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      if (CourseInstances.isDefined(id)) {
        const ci = CourseInstances.findDoc(id);
        const course = Courses.findDoc(ci.courseID);
        return course.number;
      }
      const course = Courses.findDoc(id);
      return course.number;
    }
    return null;
  },
  detailCourseNumber() {
    if (Template.instance().state.get('detailCourseID')) {
      const ci = CourseInstances.findDoc(Template.instance().state.get('detailCourseID'));
      const course = Courses.findDoc(ci.courseID);
      return course;
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
      return { currentSemester, semester, dictionary: Template.instance().state };
    }
    return null;
  },
  getDictionary() {
    return Template.instance().state;
  },
  hasCourse() {
    return Template.instance().state.get('detailCourseID');
  },
  hasMoreYears() {
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    return ays.length > 3;
  },
  hasNextYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return ays[ays.length - 1].year > instance.state.get('startYear');
    }
    return false;
  },
  hasOpportunity() {
    return Template.instance().state.get('detailOpportunityID');
  },
  hasPrevYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({
      studentID: getUserIdFromRoute(),
    }, { sort: { year: 1 } }).fetch();
    if (ays.length > 0) {
      return ays[0].year < instance.state.get('startYear') - 3;
    }
    return false;
  },
  hasRequest() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const instance = OpportunityInstances.findDoc(id);
        return VerificationRequests.find({ opportunityInstanceID: instance._id }).count() > 0;
      }
    }
    return false;
  },
  instanceID() {
    if (Template.instance().state.get('detailCourseID')) {
      return Template.instance().state.get('detailCourseID');
    } else
      if (Template.instance().state.get('detailOpportunityID')) {
        return Template.instance().state.get('detailOpportunityID');
      }
    return null;
  },
  instanceSemester() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      try {
        const ci = CourseInstances.findDoc(id);
        const semester = Semesters.findDoc(ci.semesterID);
        return Semesters.toString(semester._id, false);
      } catch (e) {
        return '';
      }
    } else
      if (Template.instance().state.get('detailOpportunityID')) {
        const id = Template.instance().state.get('detailOpportunityID');
        const opp = Opportunities.findDoc(id);
        return opp.semesterID;
      }
    return null;
  },
  isInstance() {
    return Template.instance().state.get('detailCourseID') || Template.instance().state.get('detailOpportunityID');
  },
  isDeletableInstance() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      try {
        const ci = CourseInstances.findDoc(id);
        return !ci.verified;
      } catch (e) {
        return false;
      }
    } else
      if (Template.instance().state.get('detailOpportunityID')) {
        const id = Template.instance().state.get('detailOpportunityID');
        try {
          const opportunity = OpportunityInstances.findDoc(id);
          return !opportunity.verified;
        } catch (e) {
          return false;
        }
      }
    return false;
  },
  isPastInstance() {
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      try {
        const ci = CourseInstances.findDoc(id);
        const ciSemester = Semesters.findDoc(ci.semesterID);
        return ciSemester.sortBy <= currentSemester.sortBy;
      } catch (e) {
        return false;
      }
    } else
      if (Template.instance().state.get('detailOpportunityID')) {
        const id = Template.instance().state.get('detailOpportunityID');
        try {
          const opportunity = OpportunityInstances.findDoc(id);
          const requests = VerificationRequests.find({
            opportunityInstanceID: id,
            studentID: getUserIdFromRoute(),
          }).fetch();
          const oppSemester = Semesters.findDoc(opportunity.semesterID);
          return !opportunity.verified && oppSemester.sortBy <= currentSemester.sortBy && requests.length === 0;
        } catch (e) {
          return false;
        }
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
    ret = lodash.filter(opportunities, function filter(o) {
      return lodash.indexOf(o.semesterIDs, currentSemesterID) !== -1;
    });
    return ret;
  },
  opportunityDescription() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.description;
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.description;
    }
    return null;
  },
  opportunitySemester() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const semester = OpportunityInstances.getSemesterDoc(id);
        return Semesters.toString(semester.id, false);
      }
      const opportunity = Opportunities.findDoc({ _id: id });
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
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.name;
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.name;
    }
    return null;
  },
  opportunityIce() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.ice;
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.ice;
    }
    return null;
  },
  opportunityStart() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.startActive.toDateString();
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.startActive.toDateString();
    }
    return null;
  },
  opportunityMore() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.moreInformation;
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.moreInformation;
    }
    return null;
  },
  processedDate(date) {
    const processed = moment(date);
    return processed.calendar();
  },
  requestHistory() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const oppInstance = OpportunityInstances.findDoc(id);
        const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
        if (request.length > 0) {
          return request[0].processed;
        }
      }
    }
    return '';
  },
  requestStatus() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const oppInstance = OpportunityInstances.findDoc(id);
        const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
        if (request.length > 0) {
          return request[0].status;
        }
      }
    }
    return '';
  },
  requestWhenSubmitted() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const oppInstance = OpportunityInstances.findDoc(id);
        const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
        if (request.length > 0) {
          const submitted = moment(request[0].submittedOn);
          return submitted.calendar();
        }
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
      return { currentSemester, semester, dictionary: Template.instance().state };
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
      return { currentSemester, semester, dictionary: Template.instance().state };
    }
    return null;
  },
  yearC(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis).c;
  },
  yearE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis).e;
  },
  yearI(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis).i;
  },
  yearICE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis);
  },
  yearPlanningC(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getPlanningICE(cis).c;
  },
  yearPlanningE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getPlanningICE(cis).e;
  },
  yearPlanningI(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(oi);
    });
    return getPlanningICE(cis).i;
  },
  yearPlanningICE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(), semesterID: sem,
      }).fetch();
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
    const ret = lodash.filter(ay, function filter(academicYear) {
      const year = academicYear.year;
      if (year >= instance.state.get('startYear') - 3 && year <= instance.state.get('startYear')) {
        return true;
      }
      return false;
    });
    return ret;
  },
});

Template.Academic_Plan_2.events({
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
    const student = Users.findDoc(getUserIdFromRoute()).username;
    VerificationRequests.define({ student, opportunityInstance });
  },
  'click .course.item': function clickCourseItem(event) {
    event.preventDefault();
    const courseArr = Courses.find({ _id: event.target.id }).fetch();
    if (courseArr.length > 0) {
      Template.instance().state.set('detailCourseID', event.target.id);
      Template.instance().state.set('detailOpportunityID', null);
    }
  },
  'click .item.inspect.course': function clickItemInspectCourse(event) {
    event.preventDefault();
    // console.log(event);
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    const courseArr = Courses.find({ number: split[1] }).fetch();
    if (courseArr.length > 0) {
      template.state.set(plannerKeys.detailCourse, courseArr[0]);
      template.state.set(plannerKeys.detailCourseInstance, null);
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    }
  },
  'click .item.inspect.opportunity': function clickItemInspectOpportunity(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    const oppArr = OpportunityInstances.find({ _id: split[1] }).fetch();
    if (oppArr.length > 0) {
      template.state.set(plannerKeys.detailCourse, null);
      template.state.set(plannerKeys.detailCourseInstance, null);
      template.state.set(plannerKeys.detailOpportunity, oppArr[0]);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    }
  },
  'click #nextYear': function clickNextYear(event) {
    event.preventDefault();
    const year = Template.instance().state.get('startYear');
    Template.instance().state.set('startYear', year + 1);
  },
  'click .opportunity.item': function clickOpportunityItem(event) {
    event.preventDefault();
    const opportunityArr = Opportunities.find({ _id: event.target.id }).fetch();
    if (opportunityArr.length > 0) {
      Template.instance().state.set('detailCourseID', null);
      Template.instance().state.set('detailOpportunityID', event.target.id);
    }
  },
  'click #prevYear': function clickPrevYear(event) {
    event.preventDefault();
    const year = Template.instance().state.get('startYear');
    Template.instance().state.set('startYear', year - 1);
  },
  'click tr.clickEnabled': function clickTrClickEnabled(event) {
    event.preventDefault();
    const logger = new Logger('academic-plan.clickTrClickEnabled');
    let target = event.target;
    while (target && target.nodeName !== 'TR') {
      target = target.parentNode;
    }
    const firstClass = target.getAttribute('class').split(' ')[0];
    const template = Template.instance();
    if (firstClass === 'courseInstance') {
      if (CourseInstances.isDefined(target.id)) {
        const ci = CourseInstances.findDoc(target.id);
        // eslint-disable-next-line max-len
        logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}} ${ci.grade}`);
        // console.log(moment().format('YYYY-MM-DDTHH:mm:ss.SSS'), 'clickTrClickEnabled', ci.ice, ci.grade);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, ci);
        template.state.set(plannerKeys.detailICE, ci.ice);
      } else {
        const course = Courses.findDoc(target.id);
        template.state.set(plannerKeys.detailCourse, course);
        template.state.set(plannerKeys.detailCourseInstance, null);
      }
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    } else
      if (firstClass === 'opportunityInstance') {
        if (OpportunityInstances.isDefined(target.id)) {
          const oi = OpportunityInstances.findDoc(target.id);
          template.state.set(plannerKeys.detailOpportunity, null);
          template.state.set(plannerKeys.detailOpportunityInstance, oi);
          template.state.set(plannerKeys.detailICE, oi.ice);
        } else {
          const opportunity = Opportunities.findDoc(target.id);
          template.state.set(plannerKeys.detailOpportunity, opportunity);
          template.state.set(plannerKeys.detailOpportunityInstance, null);
        }
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
      }
  },
  'click .jsDelCourse': function clickJsDelCourse(event) {
    event.preventDefault();
    Template.instance().state.set('detailCourseID', null);
    Template.instance().state.set('detailOpportunityID', null);
  },
});

Template.Academic_Plan_2.onCreated(function academicPlan2OnCreated() {
  this.state = new ReactiveDict();
  if (this.data) {
    this.state.set('currentSemesterID', this.data.currentSemesterID);
    this.state.set('studentUsername', this.data.studentUserName);
  } else {
    console.log('there is a problem no data.'); // eslint-disable-line no-console
  }
  this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Academic_Plan_2.onRendered(function academicPlan2OnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});

Template.Academic_Plan_2.onDestroyed(function academicPlan2OnDestroyed() {
  // add your statement here
});

