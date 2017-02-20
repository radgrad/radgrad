import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection.js';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Teaser_Widget.onCreated(function studentTeaserWidgetOnCreated() {
  this.subscribe(Teasers.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

function matchingTeasers() {
  const allTeasers = Teasers.find().fetch();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let teaserInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allTeasers, (teaser) => {
    teaserInterests = [];
    _.map(teaser.interestIDs, (id) => {
      teaserInterests.push(Interests.findDoc(id));
      _.map(teaserInterests, (teaserInterest) => {
        _.map(userInterests, (userInterest) => {
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

Template.Student_Teaser_Widget.helpers({
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunitySlug(teaser) {
    let ret;
    if (teaser.opportunityID) {
      ret = Slugs.findDoc(Opportunities.findDoc(teaser.opportunityID).slugID).name;
    } else {
      ret = '#';
    }
    return ret;
  },
  teasers() {
    return matchingTeasers();
  },
  teaserCount() {
    return matchingTeasers().length;
  },
  teaserTitle(teaser) {
    return teaser.title;
  },
  teaserAuthor(teaser) {
    return teaser.author;
  },
  teaserUrl(teaser) {
    return teaser.url;
  },
});

Template.Student_Teaser_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Teaser_Widget.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed();
  }, 300);
});
