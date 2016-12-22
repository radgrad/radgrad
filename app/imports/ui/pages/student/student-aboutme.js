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
import { getRouteUserName } from '../../components/shared/route-user-name.js';

Template.Student_AboutMe.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  desiredDegree() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
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
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  getEmail() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.email;
    }
    return '';
  },
  getWebsite() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.website;
    }
    return '';
  },
  interests() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
});

Template.Student_AboutMe.events({
  'submit .email': function submitEmail(event) {
    event.preventDefault();
    const student = Users.findDoc(getRouteUserName());
    const choice = event.target.emailAddress.value;
    Users.setEmail(student._id, choice);
  },
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const student = Users.findDoc(getRouteUserName());
    const choice = event.target.website.value;
    Users.setWebsite(student._id, choice);
  },
});

Template.Student_AboutMe.onCreated(function studentAboutMeOnCreated() {
  this.state = new ReactiveDict();
  if (getRouteUserName()) {
    const studentID = Users.findDoc({ username: getRouteUserName() })._id;
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
  }
  if (this.data) {
    this.state.set('currentSemesterID', this.data.currentSemesterID);
    this.state.set('studentUsername', getRouteUserName());
  } else {
    console.log('there is a problem no data.'); // eslint-disable-line no-console
  }

  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_AboutMe.onRendered(function studentAboutMeOnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Student_AboutMe.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

