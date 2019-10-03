import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { isInRole, isLabel } from '../../utilities/template-helpers';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { getGroupName } from './route-group-name';

Template.Explorer_Opportunities_Widget.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.updated = new ReactiveVar(false);
});

Template.Explorer_Opportunities_Widget.helpers({
  fullName(user) {
    return Users.getFullName(user);
  },
  futureInstance(opportunity) {
    let ret = false;
    if (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
      })
        .fetch();
      _.forEach(oi, function (opportunityInstance) {
        if (Semesters.findDoc(opportunityInstance.semesterID).semesterNumber >=
          Semesters.getCurrentSemesterDoc().semesterNumber) {
          ret = true;
        }
      });
    }
    return ret;
  },
  hasTeaser(opportunity) {
    if (opportunity) {
      const teaser = Teasers.find({ targetSlugID: opportunity.slugID })
        .fetch();
      return teaser.length > 0;
    }
    return false;
  },
  isInRole,
  isLabel,
  replaceSemString(array) {
    const semString = array.join(', ');
    return semString.replace(/Summer/g, 'Sum')
      .replace(/Spring/g, 'Spr');
  },
  opportunitySemesters(opportunity) {
    if (opportunity) {
      const ois = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
      })
        .fetch();
      const currentSemester = Semesters.getCurrentSemesterDoc();
      const names = _.map(ois, (oi) => {
        const sem = Semesters.findDoc(oi.semesterID);
        if (sem.semesterNumber < currentSemester.semesterNumber) {
          if (oi.verified) {
            return `Verified ${Semesters.toString(oi.semesterID, false)}`;
          }
          return `Unverified ${Semesters.toString(oi.semesterID, false)}`;
        }
        return `In plan ${Semesters.toString(oi.semesterID, false)}`;
      });
      return names.join(', ');
    }
    return '';
  },
  review() {
    if (this.item) {
      let review = '';
      review = Reviews.find({
        studentID: getUserIdFromRoute(),
        revieweeID: this.item._id,
      })
        .fetch();
      return review[0];
    }
    return '';
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  unverified(opportunity) {
    let ret = false;
    if (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
      })
        .fetch();
      _.forEach(oi, function (opportunityInstance) {
        if (!opportunityInstance.verified) {
          ret = true;
        }
      });
    }
    return ret;
  },
  updatedTeaser(teaser) {
    return teaser;
  },
  userPicture(user) {
    return Users.getProfile(user).picture || defaultProfilePicture;
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userStatus(opportunity) {
    let ret = false;
    if (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
      })
        .fetch();
      if (oi.length > 0) {
        ret = true;
      }
    }
    return ret;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

Template.Explorer_Opportunities_Widget.onRendered(function enableVideo() {
  setTimeout(function () {
    this.$('.ui.embed')
      .embed();
  }, 300);
  const template = this;
  template.$('.chooseSemester')
    .popup({
      on: 'click',
    });
});
