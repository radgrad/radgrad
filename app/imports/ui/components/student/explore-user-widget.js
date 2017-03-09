import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.findDoc({ username })._id;
}

Template.Explore_User_Widget.helpers({
  desiredDegree() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return DesiredDegrees.findDoc(Users.findDoc(id).desiredDegreeID).shortName;
    }
    return '';
  },
  email() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.getEmail(id);
    }
    return '';
  },
  firstName() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.firstName;
    }
    return '';
  },
  isMentor() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.roles[0] === ROLE.MENTOR;
    }
    return false;
  },
  isStudent() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.roles[0] === ROLE.STUDENT;
    }
    return false;
  },
  level() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.level;
    }
    return 6;
  },
  name() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      if (user.picture) {
        return user.picture;
      }
      return '/images/default-profile-picture.png';
    }
    return '';
  },
  role() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.roles[0];
    }
    return '';
  },
  userID() {
    return Template.instance().userID;
  },
  website() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.findDoc(id).website;
    }
    return '';
  },
});

Template.Explore_User_Widget.events({
  // add your events here
});

Template.Explore_User_Widget.onCreated(function exploreUserWidgetOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(5), getExplorerUserID());
  });
});

Template.Explore_User_Widget.onRendered(function exploreUserWidgetOnRendered() {
  // add your statement here
});

Template.Explore_User_Widget.onDestroyed(function exploreUserWidgetOnDestroyed() {
  // add your statement here
});

