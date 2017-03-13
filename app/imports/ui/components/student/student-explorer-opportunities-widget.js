import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as RouteNames from '/imports/startup/client/router.js';
import { ReactiveVar } from 'meteor/reactive-var';


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
    _.map(oi, function (opportunityInstance) {
      if (Semesters.findDoc(opportunityInstance.semesterID).sortBy >= Semesters.getCurrentSemesterDoc().sortBy) {
        ret = true;
      }
    });
    return ret;
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
    _.map(oi, function (opportunityInstance) {
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
    return RouteNames.studentExplorerUsersPageRouteName;
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

Template.Student_Explorer_Opportunities_Widget.events({

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


Template.Student_Explorer_Opportunities_Widget.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.updated = new ReactiveVar(false);
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
});
