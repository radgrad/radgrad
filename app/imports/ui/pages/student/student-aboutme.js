import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Tracker } from 'meteor/tracker';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';


import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { BS_CS_TEMPLATE, BA_ICS_TEMPLATE } from '../../../api/degree-program/degree-program';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import * as courseUtils from '../../../api/course/CourseFunctions';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';


Template.Student_AboutMe.helpers({
  getDictionary() {
    return Template.instance().state;
  },
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
      console.log("inside the if");
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
    return 'Invalid Student';
  },

  /*Academic plan helpers*/
  /*Returns all course instances in student's plan*/
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: SessionState.get(sessionKeys.CURRENT_STUDENT_ID) }).fetch();
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        ret.push(courseInstance);
    }
  });
    return ret;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    const courseName = course.shortName;
    return courseName;
  },
  isPast(event) {
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    const semesterID = event.semesterID;
    const semester = Semesters.findDoc(semesterID);
    if (semester && currentSemester) {
      return semester.sortBy < currentSemester.sortBy;
    }
    return null;
  },
  /*Returns all opportunities in student's plan*/
  opportunities() {
    let ret = [];
    const opportunities = Opportunities.find().fetch();
    const instances = OpportunityInstances.find({ studentID: SessionState.get(sessionKeys.CURRENT_STUDENT_ID) }).fetch();
    const currentSemesterID = Semesters.getCurrentSemester();
    ret = lodash.filter(instances, function filter(o) {
      return lodash.indexOf(o.semesterIDs, currentSemesterID) !== -1;
    });
    return instances;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp);
    const oppName = opportunity.name;
    return oppName;
  },
  opportunitySem(opp) {
    const sem = Semesters.findDoc(opp);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return oppTerm + ' ' + oppYear;
  },
  requestStatus() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const oppInstance = OpportunityInstances.findDoc(id);
        const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
        if (request.length > 0) {
          return request[0].status;
        }
      }
    }
    return '';
  },
  requestWhenSubmitted() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      if (OpportunityInstances.isDefined(id)) {
        const oppInstance = OpportunityInstances.findDoc(id);
        const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
        if (request.length > 0) {
          const submitted = moment(request[0].submittedOn);
          return submitted.calendar();
        }
      }
    }
    return '';
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

  years() {
    const studentID = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
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

Template.Student_AboutMe.events({

});

Template.Student_AboutMe.onCreated(function studentAboutMeOnCreated() {
  this.state = new ReactiveDict();
  updateSessionState(SessionState);
  if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
  }
  if (this.data) {
    this.state.set('currentSemesterID', this.data.currentSemesterID);
    this.state.set('studentUsername', this.data.studentUserName);
  } else {
    console.log('there is a problem no data.'); // eslint-disable-line no-console
  }
  this.autorun(() => {
    this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});
});

Template.Student_AboutMe.onRendered(function studentAboutMeOnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Student_AboutMe.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

