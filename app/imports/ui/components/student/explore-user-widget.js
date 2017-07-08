import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';

function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.getID(username);
}

Template.Explore_User_Widget.onCreated(function exploreUserWidgetOnCreated() {
  this.autorun(() => {
    if (this.data.userID) {
      this.userID = this.data.userID;
    }
    this.subscribe(CourseInstances.publicationNames.studentID, getExplorerUserID());
  });
});

Template.Explore_User_Widget.helpers({
  desiredDegree() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const profile = Users.getProfile(Template.instance().data.userID.get());
      if (profile.academicPlanID) {
        const plan = AcademicPlans.findDoc(profile.academicPlanID);
        return DesiredDegrees.findDoc(plan.degreeID).shortName;
      }
    }
    return '';
  },
  email() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.getProfile(id).username;
    }
    return '';
  },
  firstName() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
      return user.firstName;
    }
    return '';
  },
  isMentor() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
      return user.role === ROLE.MENTOR;
    }
    return false;
  },
  isStudent() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
      return user.role === ROLE.STUDENT;
    }
    return false;
  },
  level() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
      return user.level;
    }
    return 6;
  },
  name() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.getProfile(id);
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
      const user = Users.getProfile(id);
      return user.role;
    }
    return '';
  },
  userID() {
    return Template.instance().userID;
  },
  website() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.getProfile(id).website;
    }
    return '';
  },
});

