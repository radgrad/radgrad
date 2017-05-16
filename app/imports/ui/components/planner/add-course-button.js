import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { buildSimpleName } from '../../../api/degree/PlanChoiceUtilities';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';

// /** @module ui/components/planner/Add_Course_Button */

Template.Add_Course_Button.onCreated(function addCourseButtonOnCreated() {
  this.state = this.data.dictionary;
});

Template.Add_Course_Button.helpers({
  courseName() {
    try {
      return buildSimpleName(Slugs.getNameFromID(this.course.slugID));
    } catch (e) {
      return '';
    }
  },
  equals(a, b) {
    return a === b;
  },
  existingSemesters() {
    const semesters = [];
    const course = this.course;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.map(ci, function (c) {
      semesters.push(Semesters.toString(c.semesterID, false));
    });
    return semesters;
  },
  id() {
    return this.course._id;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSem = Semesters.findDoc(currentSemesterID);
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  slug() {
    try {
      const slug = Slugs.findDoc(this.course.slugID);
      return slug.name;
    } catch (e) {
      return '';
    }
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Add_Course_Button.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const course = this.course;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: course.number,
      grade: 'B',
      student: username,
    };
    const ciID = CourseInstances.define(ci);
    const doc = CourseInstances.findDoc(ciID);
    Template.instance().state.set(plannerKeys.detailCourse, null);
    Template.instance().state.set(plannerKeys.detailCourseInstance, doc);
    Template.instance().state.set(plannerKeys.detailOpportunity, null);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
    FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
    FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
    Template.instance().$('.chooseYear').popup('hide');
    Template.instance().$('.chooseSemester').popup('hide');
  },
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const course = this.course;
    const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
    Template.instance().state.set(plannerKeys.detailCourse, course);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, null);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);

    CourseInstances.removeIt(ci._id);
    FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
    FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
    Template.instance().$('.chooseYear').popup('hide');
    Template.instance().$('.chooseSemester').popup('hide');
  },
});

Template.Add_Course_Button.onRendered(function addCourseButtonOnRendered() {
  const template = this;
  template.$('.chooseYear')
      .popup({
        on: 'click',
      });
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
