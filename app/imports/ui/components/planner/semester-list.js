/* global window */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
// import { moment } from 'meteor/momentjs:moment';

Template.Semester_List.helpers({
  dictionary() {
    window.camDebugging.early();
    window.camDebugging.early('dictionary');
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('dictionary');
    // console.log(`${moment().format('HH:mm:ss.SSS')} dictionary`);
    window.camDebugging.late();
    window.camDebugging.late('dictionary');
    return Template.instance().state;
  },
  icsCourses() {
    window.camDebugging.early();
    window.camDebugging.early('icsCourses');
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('icsCourses');
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      // console.log(`${moment().format('HH:mm:ss.SSS')} icsCourses`);
      const courses = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        note: /ICS/,
        semesterID: Template.instance().localState.get('semester')._id,
      }, { sort: { note: 1 } }).fetch();
      _.map(courses, (c) => {
        ret.push(c);
      });
    }
    window.camDebugging.late();
    return ret;
  },
  isCurrentSemester() {
    window.camDebugging.early();
    window.camDebugging.early('isCurrentSemester');
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('isCurrentSemester');
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      window.camDebugging.late();
      return semester.sortBy === currentSemester.sortBy;
    }
    window.camDebugging.late();
    return false;
  },
  isFuture() {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('isFuture');
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      // console.log(`${moment().format('HH:mm:ss.SSS')} isFuture ${semester.semesterNumber}`);
      window.camDebugging.late();
      return semester.sortBy >= currentSemester.sortBy;
    }
    window.camDebugging.late();
    return false;
  },
  localState() {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('localState');
    window.camDebugging.late();
    return Template.instance().localState;
  },
  // nonIcsCourses() {
  //   if (getRouteUserName()) {
  //     const ret = [];
  //     if (Template.instance().localState.get('semester')) {
  //       const courses = CourseInstances.find({
  //         studentID: getUserIdFromRoute(),
  //         number: /[^ICS]/,
  //         semesterID: Template.instance().localState.get('semester')._id,
  //       }).fetch();
  //       courses.forEach((c) => {
  //         if (!CourseInstances.isICS(c._id)) {
  //           ret.push(c);
  //         }
  //       });
  //     }
  //     return ret;
  //   }
  //   return null;
  // },
  opportunityName(opportunityID) {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('opportunityName');
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      if (opportunity.length > 0) {
        window.camDebugging.late();
        return opportunity[0].name;
      }
    }
    window.camDebugging.late();
    return null;
  },
  semesterName() {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('semesterName');
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      window.camDebugging.late();
      return semester.term;
    }
    window.camDebugging.late();
    return null;
  },
  semesterOpportunities() {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('semesterOpportunities');
    if (getRouteUserName()) {
      const ret = [];
      if (Template.instance().localState.get('semester')) {
        const opps = OpportunityInstances.find({
          semesterID: Template.instance().localState.get('semester')._id,
          studentID: getUserIdFromRoute(),
        }).fetch();
        window.camDebugging.late();
        return opps;
      }
      window.camDebugging.late();
      return ret;
    }
    return [];
  },
  year() {
    window.camDebugging.early();
    window.camDebugging.incHelper();
    window.camDebugging.incHelper('year');
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
});

Template.Semester_List.events({
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

Template.Semester_List.onCreated(function semesterListOnCreate() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
  // this.subscribe(CareerGoals.getPublicationName());
  // this.subscribe(CourseInstances.getPublicationName(2), getUserIdFromRoute(), this.data.semester._id);
  // this.subscribe(DesiredDegrees.getPublicationName());
  // this.subscribe(OpportunityInstances.getPublicationName(3), getUserIdFromRoute());
  // this.subscribe(OpportunityTypes.getPublicationName());
  // this.subscribe(FeedbackInstances.getPublicationName());
  // this.subscribe(Feedbacks.getPublicationName());
  // this.subscribe(Semesters.getPublicationName());
  // this.subscribe(Slugs.getPublicationName());
  // this.subscribe(Users.getPublicationName());
});

Template.Semester_List.onRendered(function semesterListOnRendered() {
  // console.log(this.data);
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
});

Template.Semester_List.onDestroyed(function semesterListOnDestroyed() {
  // add your statement here
});

