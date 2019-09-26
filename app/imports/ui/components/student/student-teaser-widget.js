import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection.js';

function matchingTeasers() {
  if (getRouteUserName()) {
    const allTeasers = Teasers.find().fetch();
    const matching = [];
    const profile = Users.getProfile(getRouteUserName());
    const userInterests = [];
    let teaserInterests = [];
    _.forEach(Users.getInterestIDs(profile.userID), (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.forEach(allTeasers, (teaser) => {
      teaserInterests = [];
      _.forEach(teaser.interestIDs, (id) => {
        teaserInterests.push(Interests.findDoc(id));
        _.forEach(teaserInterests, (teaserInterest) => {
          _.forEach(userInterests, (userInterest) => {
            if (_.isEqual(teaserInterest, userInterest)) {
              if (!_.includes(matching, teaser)) {
                matching.push(teaser);
              }
            }
          });
        });
      });
    });
    return matching;
  }
  return [];
}

Template.Student_Teaser_Widget.onCreated(function studentTeaserWidgetOnCreated() {
  this.data.teasers = matchingTeasers();
});

Template.Student_Teaser_Widget.helpers({
  careerGoalRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  courseRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  interestRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  isCareerGoal(teaser) {
    const slugDoc = Slugs.findDoc(teaser.targetSlugID);
    return slugDoc.entityName === 'CareerGoal';
  },
  isCourse(teaser) {
    const slugDoc = Slugs.findDoc(teaser.targetSlugID);
    return slugDoc.entityName === 'Course';
  },
  isInterest(teaser) {
    const slugDoc = Slugs.findDoc(teaser.targetSlugID);
    return slugDoc.entityName === 'Interest';
  },
  isOpportunity(teaser) {
    const slugDoc = Slugs.findDoc(teaser.targetSlugID);
    return slugDoc.entityName === 'Opportunity';
  },
  opportunityRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  slugName(teaser) {
    const slugDoc = Slugs.findDoc(teaser.targetSlugID);
    return slugDoc.name;
  },
  teaserCount() {
    return Template.instance().data.teasers.length;
  },
  teasers() {
    return Template.instance().data.teasers;
  },
});

Template.Student_Teaser_Widget.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed('show');
  }, 300);
});
