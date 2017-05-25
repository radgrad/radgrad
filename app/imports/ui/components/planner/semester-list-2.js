/* global window */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';

// /** @module ui/components/planner/Semester_List */

Template.Semester_List_2.onCreated(function semesterListOnCreate() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});

Template.Semester_List_2.helpers({
  dictionary() {
    return Template.instance().state;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().data.semester) {
      return CourseInstances.find({
        studentID: getUserIdFromRoute(),
        note: /ICS/,
        semesterID: Template.instance().data.semester._id,
      }, { sort: { note: 1 } }).fetch();
    }
    return ret;
  },
  localState() {
    return Template.instance().localState;
  },
  opportunityName(opportunityID) {
    const opp = OpportunityInstances.findDoc({ _id: opportunityID });
    if (opp) {
      const opportunity = Opportunities.findDoc({ _id: opp.opportunityID });
      if (opportunity) {
        // window.camDebugging.stop('opportunityName');
        const name = opportunity.name;
        if (name.length > 20) {
          return `${name.substring(0, 16)}...`;
        }
        return name;
      }
    }
    return null;
  },
  semesterOpportunities() {
    if (getRouteUserName()) {
      if (Template.instance().data.semester) {
        const opps = OpportunityInstances.find({
          semesterID: Template.instance().data.semester._id,
          studentID: getUserIdFromRoute(),
        }).fetch();
        _.forEach(opps, (opp) => {
          opp.name = Opportunities.findDoc(opp.opportunityID).name; // eslint-disable-line
        });
        return opps;
      }
    }
    return [];
  },
  year() {
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
});

Template.Semester_List_2.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const slug = event.originalEvent.dataTransfer.getData('slug');
      if (slug) {
        const username = getRouteUserName();
        const semSlug = Slugs.getNameFromID(Template.instance().localState.get('semester').slugID);
        if (Slugs.isSlugForEntity(slug, 'Course')) {
          const courseID = Slugs.getEntityID(slug, 'Course');
          const course = Courses.findDoc(courseID);
          const ci = {
            semester: semSlug,
            course: slug,
            verified: false,
            note: course.number,
            grade: 'B',
            student: username,
          };
          CourseInstances.define(ci);
        } else if (Slugs.isSlugForEntity(slug, 'Opportunity')) {
          const oi = {
            semester: semSlug,
            opportunity: slug,
            verified: false,
            student: username,
          };
          OpportunityInstances.define(oi);
        }
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
      } else {
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
    }
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
      if (CourseInstances.isDefined(target.id)) {
        const ci = CourseInstances.findDoc(target.id);
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
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
});
