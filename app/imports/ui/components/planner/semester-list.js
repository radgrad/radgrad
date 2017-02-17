import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';

Template.Semester_List.helpers({
  dictionary() {
    return Template.instance().state;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const courses = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        note: /ICS/,
        semesterID: Template.instance().localState.get('semester')._id,
      }, { sort: { note: 1 } }).fetch();
      _.map(courses, (c) => {
        ret.push(c);
      });
    }
    return ret;
  },
  isCurrentSemester() {
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy === currentSemester.sortBy;
    }
    return false;
  },
  isFuture() {
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy >= currentSemester.sortBy;
    }
    return false;
  },
  localState() {
    return Template.instance().localState;
  },
  nonIcsCourses() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const courses = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        number: /[^ICS]/,
        semesterID: Template.instance().localState.get('semester')._id,
      }).fetch();
      courses.forEach((c) => {
        if (!CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  opportunityName(opportunityID) {
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      if (opportunity.length > 0) {
        return opportunity[0].name;
      }
    }
    return null;
  },
  semesterName() {
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.term;
    }
    return null;
  },
  semesterOpportunities() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const opps = OpportunityInstances.find({
        semesterID: Template.instance().localState.get('semester')._id,
        studentID: getUserIdFromRoute(),
      }).fetch();
      return opps;
    }
    return ret;
  },
  year() {
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
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(2), getUserIdFromRoute(), this.data.semester._id);
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(OpportunityTypes.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
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

