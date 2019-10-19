import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Student_Explorer_Courses_Widget_Button.helpers({
  equals(a, b) {
    return a === b;
  },
  existingSemesters() {
    const semesters = [];
    const { course } = this;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, function (c) {
      const semester = Semesters.findDoc(c.semesterID);
      if (semester.semesterNumber >= Semesters.getCurrentSemesterDoc().semesterNumber) {
        semesters.push(Semesters.toString(c.semesterID, false));
      }
    });
    return semesters;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSem = Semesters.getCurrentSemesterDoc();
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Student_Explorer_Courses_Widget_Button.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const { course } = this;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const collectionName = CourseInstances.getCollectionName();
    const definitionData = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: course.number,
      grade: 'B',
      student: username,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (!error) {
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
        FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
        FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
      }
    });
    const interactionData = { username, type: 'addCourse', typeData: courseSlug.name };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const { course } = this;
    const semester = event.target.text;
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const semID = Semesters.getID(semSlug);
    const collectionName = CourseInstances.getCollectionName();
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
      semesterID: semID,
    }).fetch();
    if (ci > 1) {
      console.log('Too many course instances found for a single semester.');
    }
    removeItMethod.call({ collectionName, instance: ci[0]._id }, (error) => {
      if (!error) {
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
        FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
        FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
      }
    });
    const interactionData = {
      username: getRouteUserName(), type: 'removeCourse',
      typeData: Slugs.getNameFromID(course.slugID),
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Student_Explorer_Courses_Widget_Button.onRendered(function studentExplorerCoursesWidgetButtonOnRendered() {
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
