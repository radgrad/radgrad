/* global window */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
// import { Semesters } from '../../../api/semester/SemesterCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';

// import { moment } from 'meteor/momentjs:moment';
// import { Logger } from 'meteor/jag:pince';
// const sl = new Logger('SL');

Template.Semester_List_2.onCreated(function semesterListOnCreate() {
  // eslint-disable-next-line
  // sl.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Semester_List ${Semesters.toString(this.data.semester._id, false)} onCreated`);
  if (this.data) {
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});

Template.Semester_List_2.helpers({
  dictionary() {
    // eslint-disable-next-line
    // sl.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} ${Semesters.toString(Template.instance().data.semester._id, false)} dictionary`);
    // window.camDebugging.start('dictionary');
    // console.log(`${moment().format('HH:mm:ss.SSS')} dictionary`);
    // window.camDebugging.stop('dictionary');
    return Template.instance().state;
  },
  icsCourses() {
    // eslint-disable-next-line
    // sl.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} ${Semesters.toString(Template.instance().data.semester._id, false)} icsCourses`);
    // window.camDebugging.start('icsCourses');
    const ret = [];
    if (Template.instance().data.semester) {
      // console.log(`${moment().format('HH:mm:ss.SSS')} icsCourses`);
      return CourseInstances.find({
        studentID: getUserIdFromRoute(),
        note: /ICS/,
        semesterID: Template.instance().data.semester._id,
      }, { sort: { note: 1 } }).fetch();
    }
    // eslint-disable-next-line
    // sl.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} ${Semesters.toString(Template.instance().data.semester._id, false)} end icsCourses ${ret.length}`);
    // debugger;
    return ret;
  },
  localState() {
    // window.camDebugging.start('localState');
    // window.camDebugging.stop('localState');
    return Template.instance().localState;
  },
  opportunityName(opportunityID) {
    // window.camDebugging.start('opportunityName');
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      if (opportunity.length > 0) {
        // window.camDebugging.stop('opportunityName');
        return opportunity[0].name;
      }
    }
    // window.camDebugging.stop('opportunityName');
    return null;
  },
  semesterOpportunities() {
    // window.camDebugging.start('semesterOpportunities');
    if (getRouteUserName()) {
      const ret = [];
      if (Template.instance().data.semester) {
        const opps = OpportunityInstances.find({
          semesterID: Template.instance().data.semester._id,
          studentID: getUserIdFromRoute(),
        }).fetch();
        // window.camDebugging.stop('semesterOpportunities');
        _.map(opps, (opp) => {
          opp.name = Opportunities.findDoc(opp.opportunityID).name; // eslint-disable-line
        });
        return opps;
      }
      // window.camDebugging.stop('semesterOpportunities');
      return ret;
    }
    return [];
  },
  year() {
    // window.camDebugging.start('year');
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      // window.camDebugging.stop('year');
      return semester.year;
    }
    // window.camDebugging.stop('year');
    return null;
  },
});

Template.Semester_List_2.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const semesterID = Template.instance().localState.get('semester')._id;
      if (CourseInstances.isDefined(id)) {
        CourseInstances.update({ _id: id }, { $set: { semesterID } });
        // CourseInstances.updateSemester(id, semesterID);
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
        FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
        FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
        // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
      } else {
        const opportunities = OpportunityInstances.find({
          studentID: getUserIdFromRoute(),
          _id: id,
        }).fetch();
        if (opportunities.length > 0) {
          OpportunityInstances.updateSemester(opportunities[0]._id, semesterID);
        }
      }
    }
  },
  'click tr.clickEnabled': function clickTrClickEnabled(event) {
    event.preventDefault();
    // const logger = new Logger('academic-plan.clickTrClickEnabled');
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
        // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}} ${ci.grade}`);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, ci);
        template.state.set(plannerKeys.detailICE, ci.ice);
      } else if (Courses.isDefined(target.id)) {
        const course = Courses.findDoc(target.id);
        template.state.set(plannerKeys.detailCourse, course);
        template.state.set(plannerKeys.detailCourseInstance, null);
      } else {
        template.state.set(plannerKeys.detailCourse, null);
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
        } else if (Opportunities.isDefined(target.id)) {
          const opportunity = Opportunities.findDoc(target.id);
          template.state.set(plannerKeys.detailOpportunity, opportunity);
          template.state.set(plannerKeys.detailOpportunityInstance, null);
        } else {
          template.state.set(plannerKeys.detailOpportunity, null);
          template.state.set(plannerKeys.detailOpportunityInstance, null);
        }
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
      }
  },
  'click .jsDelCourse': function clickJsDelCourse(event) {
    event.preventDefault();
    const id = event.target.id;
    CourseInstances.removeIt(id);
    FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
    FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
    FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
    FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
    const template = Template.instance();
    template.state.set(plannerKeys.detailCourse, null);
    template.state.set(plannerKeys.detailCourseInstance, null);
    template.state.set(plannerKeys.detailICE, null);
    template.state.set(plannerKeys.detailOpportunity, null);
    template.state.set(plannerKeys.detailOpportunityInstance, null);
  },
  'click .jsDelOpp': function clickJsDelOpp(event) {
    event.preventDefault();
    // console.log(event.target);
    const id = event.target.id;
    OpportunityInstances.removeIt(id);
    const template = Template.instance();
    template.state.set(plannerKeys.detailCourse, null);
    template.state.set(plannerKeys.detailCourseInstance, null);
    template.state.set(plannerKeys.detailICE, null);
    template.state.set(plannerKeys.detailOpportunity, null);
    template.state.set(plannerKeys.detailOpportunityInstance, null);
  },
});

Template.Semester_List_2.onRendered(function semesterListOnRendered() {
  // eslint-disable-next-line
  // sl.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Semester_List ${Semesters.toString(this.data.semester._id, false)} onRendered`);
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
});
