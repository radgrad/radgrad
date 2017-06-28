import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Opportunities_Widget.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.updated = new ReactiveVar(false);
});

Template.Student_Explorer_Opportunities_Widget.helpers({
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  futureInstance(opportunity) {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, function (opportunityInstance) {
      if (Semesters.findDoc(opportunityInstance.semesterID).semesterNumber >=
          Semesters.getCurrentSemesterDoc().semesterNumber) {
        ret = true;
      }
    });
    return ret;
  },
  isInRole(role) {
    const group = FlowRouter.current().route.group.name;
    return group === role;
  },
  isLabel(label, value) {
    return label === value;
  },
  replaceSemString(array) {
    const semString = array.join(', ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  review() {
    let review = '';
    review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: this.item._id,
    }).fetch();
    return review[0];
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  unverified(opportunity) {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, function (opportunityInstance) {
      if (!opportunityInstance.verified) {
        ret = true;
      }
    });
    return ret;
  },
  updatedTeaser(teaser) {
    return teaser;
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
  userStatus(opportunity) {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  },
  userUsername(user) {
    return Users.findDoc(user).username;
  },
});

Template.Student_Explorer_Opportunities_Widget.onRendered(function enableVideo() {
  setTimeout(function () {
    this.$('.ui.embed').embed();
  }, 300);
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
