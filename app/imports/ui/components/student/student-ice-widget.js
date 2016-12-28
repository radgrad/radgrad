import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { sessionKeys } from '../../../startup/client/session-state';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Ice_Widget.helpers({
  earnedICE() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },
  projectedICE() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
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
  innovationPoints(ice) {
    return ice.i;
  },
  competencyPoints(ice) {
    return ice.c;
  },
  experiencePoints(ice) {
    return ice.e;
  },
  getEvents(iceType, type, earned) {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      let allInstances = [];
      const iceInstances = [];
      if (type === 'course') {
        const courseInstances = CourseInstances.find({ studentID: user._id, verified: earned }).fetch();
        courseInstances.forEach((courseInstance) => {
          if (CourseInstances.isICS(courseInstance._id)) {
            allInstances.push(courseInstance);
          }
        });
      }
      else {
        allInstances = OpportunityInstances.find({ studentID: user._id, verified: earned }).fetch();
      }
      allInstances.forEach((instance) => {
        if (iceType === 'i') {
          if (instance.ice.i > 0) {
            iceInstances.push(instance);
          }
        }
        else if (iceType === 'c') {
          iceInstances.push(instance);
        }
        else if (iceType === 'e') {
          if (instance.ice.e > 0) {
            iceInstances.push(instance);
          }
        }
        else {
          return null;
        }
      });
      return iceInstances;
    }
    return null;
  },

  recommendedEvents(iceType, type, earned) {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      let allInstances = [];
      const recommendedInstances = [];
      if (type === 'course') {
        const courseInstances = CourseInstances.find({ studentID: user._id, verified: earned }).fetch();
        courseInstances.forEach((courseInstance) => {
          if (CourseInstances.isICS(courseInstance._id)) {
          allInstances.push(courseInstance);
        }
      });
      }
      else {
        allInstances = OpportunityInstances.find({ studentID: user._id, verified: earned }).fetch();
      }
      allInstances.forEach((instance) => {
        if (iceType === 'i') {
        if (instance.ice.i > 0) {
          iceInstances.push(instance);
        }
      }
    else if (iceType === 'c') {
        iceInstances.push(instance);
      }
      else if (iceType === 'e') {
          if (instance.ice.e > 0) {
            iceInstances.push(instance);
          }
        }
        else {
          return null;
        }
    });
      return iceInstances;
    }
    return null;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    return opportunity.name;
  },
  eventSem(event) {
    const sem = Semesters.findDoc(event.semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return `${oppTerm} ${oppYear}`;
  },
  eventIce(event) {
    return event.ice;
  },
});

Template.Student_Ice_Widget.events({
  // add events here
});

Template.Student_Ice_Widget.onCreated(function studentIceOnCreated() {
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

Template.Student_Ice_Widget.onDestroyed(function studentIceOnDestroyed() {
  // add your statement here
});

Template.Student_Ice_Widget.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title .icon',
    },
    exclusive: false,
  });
});

