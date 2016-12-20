import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { ReactiveDict } from 'meteor/reactive-dict';

import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import * as courseUtils from '../../../api/course/CourseFunctions';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0) {
    const filtered = lodash.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: SessionState.get(sessionKeys.CURRENT_STUDENT_ID),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    return filtered;
  }
  return [];
};

Template.Student_Ice.helpers({
  earnedICE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },
  projectedICE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const courseInstances = CourseInstances.find({ studentID: user._id }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getPlanningICE(earnedInstances);
      if (ice.i > 100) {
        ice.i = 100;
      }
      if (ice.c > 100) {
        ice.c = 100;
      }
      if (ice.e > 100) {
        ice.e = 100;
      }
      return ice;
    }
    return null;
  },
  remainingICE(earned, projected) {
    return projected - earned;
  },
  earnedEventsI() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const earnedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.i > 0) {
          earnedInstances.push(courseInstance);
        }
    });
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.i > 0) {
        earnedInstances.push(oppInstance);
      }
    });

      return earnedInstances;
    }
    return null;
  },
  earnedEventsC() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const earnedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.c > 0) {
        earnedInstances.push(courseInstance);
      }
    });
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.c > 0) {
        earnedInstances.push(oppInstance);
      }
    });

      return earnedInstances;
    }
    return null;
  },
  earnedEventsE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const earnedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.e > 0) {
        earnedInstances.push(courseInstance);
      }
    });
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.e > 0) {
        earnedInstances.push(oppInstance);
      }
    });

      return earnedInstances;
    }
    return null;
  },
  projectedEventsI() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const plannedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: false }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.i > 0){
        plannedInstances.push(courseInstance);
      }});
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: false }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.i > 0){
        plannedInstances.push(oppInstance);
      }
    });
      return plannedInstances;
    }
    return null;
  },
  projectedEventsC() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const plannedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: false }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.c > 0){
        plannedInstances.push(courseInstance);
      }});
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: false }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.c > 0){
        plannedInstances.push(oppInstance);
      }
    });
      return plannedInstances;
    }
    return null;
  },
  projectedEventsE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const plannedInstances = [];
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: false }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (courseInstance.ice.e > 0){
        plannedInstances.push(courseInstance);
      }});
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: false }).fetch();
      oppInstances.forEach((oppInstance) => {
        if (oppInstance.ice.e > 0){
        plannedInstances.push(oppInstance);
      }
      });
      return plannedInstances;
    }
    return null;
  },

  recommendedEventsI() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const allEvents = [];
      const allCourses = CourseInstances.find().fetch();

      allCourses.forEach((courseInstance) => {
        if (CourseInstances.isICS(courseInstance._id)){
        allEvents.push(courseInstance);
      }
    });
      return allEvents;
    }
    return null;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    const courseName = course.shortName;
    return courseName;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    const oppName = opportunity.name;
    return oppName;
  },
  opportunitySem(opp) {
    const sem = Semesters.findDoc(opp.semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return oppTerm + ' ' + oppYear;
  },
  isCourse(c) {
    if(c.opportunityID == null && c.sponsorID == null) {
      return true;
    }
    else {
      return false;
    }
  }
});

Template.Student_Ice.events({
  //add events here
});

Template.Student_Ice.onCreated(function studentIceOnCreated() {
  this.state = new ReactiveDict();
  updateSessionState(SessionState);
  if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
  }
  this.autorun(() => {
    this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});
});

Template.Student_Ice.onDestroyed(function studentIceOnDestroyed() {
  // add your statement here
});

Template.Student_Ice.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title .icon'
    },
    exclusive: false
  })

});
