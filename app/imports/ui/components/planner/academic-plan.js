import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { lodash } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
// import { checkPrerequisites } from '../../../api/course/CourseFunctions';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
// import { Users } from '../../../api/user/UserCollection.js';
import { getTotalICE, makeCourseICE, getPlanningICE } from '../../../api/ice/IceProcessor.js';

Template.Academic_Plan_2.helpers({
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
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
      return { currentSemester, semester };
    }
    return null;
  },
  hasCourse() {
    return Template.instance().state.get('detailCourseID');
  },
  hasMoreYears() {
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays.length > 3;
  },
  hasNextYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays[ays.length - 1].year > instance.state.get('startYear');
  },
  hasOpportunity() {
    return Template.instance().state.get('detailOpportunityID');
  },
  hasPrevYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays[0].year < instance.state.get('startYear') - 3;
  },
  instanceID() {
    if (Template.instance().state.get('detailCourseID')) {
      return Template.instance().state.get('detailCourseID');
    } else if (Template.instance().state.get('detailOpportunityID')) {
      return Template.instance().state.get('detailOpportunityID');
    }
    return null;
  },
  instanceSemester() {
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      const ci = CourseInstances.findDoc(id);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.toString(semester._id, false);
    } else if (Template.instance().state.get('detailOpportunityID')) {
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
      const ci = CourseInstances.findDoc(id);
      return !ci.verified;
    } else if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = OpportunityInstances.findDoc(id);
      return !opportunity.verified;
    }
    return false;
  },
  isPastInstance() {
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    if (Template.instance().state.get('detailCourseID')) {
      const id = Template.instance().state.get('detailCourseID');
      const ci = CourseInstances.findDoc(id);
      const ciSemester = Semesters.findDoc(ci.semesterID);
      return ciSemester.sortBy <= currentSemester.sortBy;
    } else if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = OpportunityInstances.findDoc(id);
      const oppSemester = Semesters.findDoc(opportunity.semesterID);
      return !opportunity.verified && oppSemester.sortBy <= currentSemester.sortBy;
    }
    return false;
  },
  isFuture(year) {
    return year.year >= moment().year();
  },
  opportunities() {
    let ret = [];
    const opportunities = Opportunities.find().fetch();
    const now = new Date();
    // console.log(opportunities[0]);
    ret = lodash.filter(opportunities, function filter(o) {
      return (now >= o.startActive && now <= o.endActive);
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
  opportunityEnd() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const op = OpportunityInstances.findDoc(id);
        const opp = Opportunities.findDoc(op.opportunityID);
        return opp.endActive.toDateString();
      }
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.endActive.toDateString();
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
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({ studentID: Meteor.userId(), semesterID: sem }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({ studentID: Meteor.userId(), semesterID: sem }).fetch();
      cis = cis.concat(oi);
    });
    return getTotalICE(cis);
  },
  yearPlanningICE(year) {
    let cis = [];
    const semesterIDs = year.semesterIDs;
    semesterIDs.forEach((sem) => {
      const ci = CourseInstances.find({ studentID: Meteor.userId(), semesterID: sem }).fetch();
      cis = cis.concat(ci);
      const oi = OpportunityInstances.find({ studentID: Meteor.userId(), semesterID: sem }).fetch();
      cis = cis.concat(oi);
    });
    return getPlanningICE(cis);
  },
  years() {
    const ay = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
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
    const student = Meteor.userId();
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
      template.state.set('detailCourseID', courseArr[0]._id);
      template.state.set('detailOpportunityID', null);
    }
  },
  'click .item.inspect.opportunity': function clickItemInspectOpportunity(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    const courseArr = OpportunityInstances.find({ _id: split[1] }).fetch();
    if (courseArr.length > 0) {
      template.state.set('detailCourseID', null);
      template.state.set('detailOpportunityID', courseArr[0].opportunityID);
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
    let target = event.target;
    while (target && target.nodeName !== 'TR') {
      target = target.parentNode;
    }
    const firstClass = target.getAttribute('class').split(' ')[0];
    const template = Template.instance();
    if (firstClass === 'courseInstance') {
      template.state.set('detailCourseID', target.id);
      template.state.set('detailOpportunityID', null);
    } else
      if (firstClass === 'opportunityInstance') {
        template.state.set('detailCourseID', null);
        template.state.set('detailOpportunityID', target.id);
      }
  },
});

Template.Academic_Plan_2.onCreated(function academicPlan2OnCreated() {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
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

