import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { sessionKeys } from '../../../startup/client/session-state';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/';

Template.Student_AboutMe.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  careerGoals() {
    const ret = [];
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
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
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.desiredDegree === 'BS_CS') {
        return 'B.S. CS';
      } else
        if (user.desiredDegree === 'BA_ICS') {
          return 'B.A. ICS';
        }
    }
    return '';
  },
  getName() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  getEmail() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      return user.email;
    }
    return '';
  },
  getWebsite() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      return user.website;
    }
    return '';
  },
  interests() {
    const ret = [];
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },

  /*Returns all course instances in student's plan*/
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
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
    const instances = OpportunityInstances.find({ studentID: getUserIdFromRoute() }).fetch();
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
});

Template.Student_AboutMe.events({
  'submit .email' (event) {
    event.preventDefault();
    const student = Users.findDoc(getUserIdFromRoute());
    const choice = event.target.emailAddress.value;
    Users.setEmail(student._id, choice);
  },
  'submit .website' (event) {
    event.preventDefault();
    const student = Users.findDoc(getUserIdFromRoute());
    const choice = event.target.website.value;
    Users.setWebsite(student._id, choice);
  },
});

Template.Student_AboutMe.onCreated(function studentAboutMeOnCreated() {
  this.state = new ReactiveDict();
  if (getUserIdFromRoute()) {
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, getUserIdFromRoute());
  }
  if (this.data) {
    this.state.set('currentSemesterID', this.data.currentSemesterID);
    this.state.set('studentUsername', this.data.studentUserName);
  } else {
    console.log('there is a problem no data.'); // eslint-disable-line no-console
  }
  this.autorun(() => {
    this.subscribe(CareerGoals.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Student_AboutMe.onRendered(function studentAboutMeOnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Student_AboutMe.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

