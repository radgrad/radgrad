import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';


Template.Student_About_Me_Widget.onCreated(function studentAboutMeWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_About_Me_Widget.helpers({
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
  name() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  email() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return Users.getEmail(user._id);
    }
    return '';
  },
  website() {
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
  interestName(interest) {
    return interest.name;
  },
  goalName(goal) {
    return goal.name;
  },
});

Template.Student_About_Me_Widget.events({
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const user = Users.findDoc({ username: getRouteUserName() });
    const choice = event.target.website.value;
    console.log("hello");
    Users.setWebsite(user._id, choice);
  },
});

Template.Student_About_Me_Widget.onRendered(function studentAboutMeOnRendered() {
  // add your statement here
});

Template.Student_About_Me_Widget.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

