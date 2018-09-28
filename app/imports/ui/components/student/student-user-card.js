import { Template } from 'meteor/templating';
// import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
// import { getExplorerUserID } from '../../utilities/template-helpers';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { ROLE } from '../../../api/role/Role';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

Template.Student_User_Card.onCreated(function studentusercardOnCreated() {
  this.autorun(() => {
    if (this.data.user) {
      this.user = this.data.user;
    }
    // this.subscribe(CourseInstances.publicationNames.studentID, getExplorerUserID());
  });
});

Template.Student_User_Card.helpers({
  desiredDegree() {
    if (Template.instance().user) {
      const profile = Template.instance().data.user;
      if (profile.academicPlanID) {
        const plan = AcademicPlans.findDoc(profile.academicPlanID);
        return DesiredDegrees.findDoc(plan.degreeID).shortName;
      }
    }
    return '';
  },
  email() {
    if (Template.instance().user) {
      return Template.instance().user.username;
    }
    return '';
  },
  firstName() {
    if (Template.instance().user) {
      return Template.instance().user.firstName;
    }
    return '';
  },
  isFaculty() {
    if (Template.instance().user) {
      return Template.instance().user.role === ROLE.FACULTY;
    }
    return false;
  },
  isAdvisor() {
    if (Template.instance().user) {
      return Template.instance().user.role === ROLE.ADVISOR;
    }
    return false;
  },
  isMentor() {
    if (Template.instance().user) {
      return Template.instance().user.role === ROLE.MENTOR;
    }
    return false;
  },
  isStudent() {
    if (Template.instance().user) {
      return Template.instance().user.role === ROLE.STUDENT;
    }
    return false;
  },
  isAlumni() {
    if (Template.instance().user) {
      return Template.instance().user.role === ROLE.ALUMNI;
    }
    return false;
  },
  level() {
    if (Template.instance().user) {
      return Template.instance().user.level;
    }
    return 6;
  },
  name() {
    if (Template.instance().user) {
      return `${Template.instance().user.firstName} ${Template.instance().user.lastName}`;
    }
    return '';
  },
  picture() {
    if (Template.instance().user) {
      if (Template.instance().user.picture) {
        return Template.instance().user.picture;
      }
      return defaultProfilePicture;
    }
    return '';
  },
  role() {
    if (Template.instance().user) {
      return Template.instance().user.role;
    }
    return '';
  },
  user() {
    return Template.instance().user;
  },
  userID() {
    return Template.instance().user.userID;
  },
  website() {
    if (Template.instance().user) {
      return Template.instance().user.website;
    }
    return '';
  },
});

Template.Student_User_Card.events({
  // add your events here
});

Template.Student_User_Card.onRendered(function studentusercardOnRendered() {
  // add your statement here
});

Template.Student_User_Card.onDestroyed(function studentusercardOnDestroyed() {
  // add your statement here
});

