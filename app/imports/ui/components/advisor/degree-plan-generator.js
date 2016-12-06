import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { BS_CS_TEMPLATE, BA_ICS_TEMPLATE } from '../../../api/degree-program/degree-program';
import { generateCoursePlan } from '../../../api/degree-program/plan-generator';
import { Interests } from '../../../api/interest/InterestCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import * as courseUtils from '../../../api/course/CourseFunctions';
import { Users } from '../../../api/user/UserCollection.js';
import { studentDegreePlannerPageRouteName } from '../../../startup/client/router';

Template.Degree_Plan_Generator.helpers({
  careerGoals() {
    const ret = [];
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  currentSemesterName() {
    const currentSemesterID = Semesters.getCurrentSemester();
    return Semesters.toString(currentSemesterID, false);
  },
  desiredDegree() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.desiredDegree === 'BS_CS') {
        return 'B.S. CS';
      } else if (user.desiredDegree === 'BA_ICS') {
        return 'B.A. ICS';
      }
    }
    return '';
  },
  futureSemesters() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    return _.filter(Semesters.find({ sortBy: { $gte: currentSemester.sortBy } }, { sort: { sortBy: 1 } }).fetch(),
        function notSummer(s) {
          return s.term !== Semesters.SUMMER;
        });
  },
  interests() {
    const ret = [];
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  selectedSemester(semester) {
    return Template.instance().state.get('selectedSemester') === semester;
  },
  semesterName(semester) {
    return Semesters.toString(semester._id, false);
  },
  semesterSlug(semester) {
    return Semesters.getSlug(semester._id);
  },
  userFullName() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return Users.getFullName(user._id);
    }
    return 'Select a student';
  },
});

Template.Degree_Plan_Generator.events({
  'click .jsSemester': function clickJsInterests(event, instance) {
    event.preventDefault();
    const choice = event.target.parentElement.getElementsByTagName('input')[0].value;
    const id = Semesters.getID(choice);
    instance.state.set('selectedSemester', Semesters.findDoc(id));
  },
  'click .jsGeneratePlan': function clickGeneratePlan(event, instance) {
    event.preventDefault();
    const studentID = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    const student = Users.findDoc(studentID);
    let template;
    if (student.desiredDegree === 'BS_CS') {
      template = BS_CS_TEMPLATE;
    }
    if (student.desiredDegree === 'BA_ICS') {
      template = BA_ICS_TEMPLATE;
    }
    const currentSemester = Semesters.getCurrentSemesterDoc();
    let startSemester = instance.state.get('selectedSemester');
    if (currentSemester.sortBy === startSemester.sortBy) {
      startSemester = semUtils.nextFallSpringSemester(startSemester);
    }
    // TODO: CAM do we really want to blow away the student's plan. What if they've made changes?
    courseUtils.clearPlannedCourseInstances(studentID);
    const cis = CourseInstances.find({ studentID }).fetch();
    const ays = AcademicYearInstances.find({ studentID }).fetch();
    if (cis.length === 0) {
      _.map(ays, (year) => {
        AcademicYearInstances.removeIt(year._id);
      });
    } else {
      // TODO: CAM figure out which AYs to remove.
    }

    generateCoursePlan(template, startSemester, student);
    FlowRouter.go(studentDegreePlannerPageRouteName);
  },
});

Template.Degree_Plan_Generator.onCreated(function degreePlanGeneratorOnCreated() {
  this.state = new ReactiveDict();
  updateSessionState(SessionState);
});

Template.Degree_Plan_Generator.onRendered(function degreePlanGeneratorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Degree_Plan_Generator.onDestroyed(function degreePlanGeneratorOnDestroyed() {
  // add your statement here
});

