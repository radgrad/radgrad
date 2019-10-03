import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from './route-user-name';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { getUserIdFromRoute } from './get-user-id-from-route';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getGroupName } from './route-group-name';

export const sortOrderKeys = {
  match: 'match',
  i: 'innovation',
  e: 'experience',
  alpha: 'alphabetical',
};

Template.Card_Explorer_Opportunities_Widget.onCreated(function studentCardExplorerOppWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
  this.sortOrder = new ReactiveVar(sortOrderKeys.match);
});

const availableOpps = () => {
  const notRetired = Opportunities.findNonRetired({});
  const currentSemester = Semesters.getCurrentSemesterDoc();
  const group = getGroupName();
  const studentID = getUserIdFromRoute();
  if (group === 'student') {
    const favorites = FavoriteOpportunities.findNonRetired({ studentID });
    const favoriteIDs = _.map(favorites, (f) => f.opportunityID);
    const filteredBySem = _.filter(notRetired, function filter(opp) {
      return !_.includes(favoriteIDs, opp._id);
    });
    const filteredByInstance = _.filter(filteredBySem, function filter(opp) {
      let inFuture = false;
      _.forEach(opp.semesterIDs, (semID) => {
        const sem = Semesters.findDoc(semID);
        if (sem.semesterNumber >= currentSemester.semesterNumber) {
          inFuture = true;
        }
      });
      return inFuture;
    });
    return filteredByInstance;
  } else if (group === 'faculty') {
    return _.filter(notRetired, o => o.sponsorID !== getUserIdFromRoute());
  }
  return notRetired;
};

// TODO Can we move this code into some sort of helperFunction file? I've seen this a lot.
function matchingOpportunities() {
  const allOpportunities = availableOpps();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allOpportunities, interestIDs);
    return preferred.getOrderedChoices();
  }
  return allOpportunities;
}

function hiddenOpportunitiesHelper() {
  if (getRouteUserName()) {
    const opportunities = matchingOpportunities();
    let nonHiddenOpportunities;
    if (Template.instance()
      .hidden
      .get()) {
      const profile = Users.getProfile(getRouteUserName());
      nonHiddenOpportunities = _.filter(opportunities, (opp) => {
        if (_.includes(profile.hiddenOpportunityIDs, opp._id)) {
          return false;
        }
        return true;
      });
    } else {
      nonHiddenOpportunities = opportunities;
    }
    return nonHiddenOpportunities;
  }
  return [];
}

Template.Card_Explorer_Opportunities_Widget.helpers({
  hidden() {
    return Template.instance()
      .hidden
      .get();
  },
  hiddenExists() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (profile.hiddenOpportunityIDs) {
        return profile.hiddenOpportunityIDs.length !== 0;
      }
    }
    return false;
  },
  noInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.interestIDs.length === 0;
    }
    return true;
  },
  itemCount() {
    return hiddenOpportunitiesHelper().length;
  },
  opportunities() {
    const opportunities = matchingOpportunities();
    let visibleOpportunities;
    if (Template.instance()
      .hidden
      .get()) {
      visibleOpportunities = hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    switch (Template.instance().sortOrder.get()) {
      case sortOrderKeys.i:
        visibleOpportunities = _.sortBy(visibleOpportunities, (o) => o.ice.i).reverse();
        break;
      case sortOrderKeys.e:
        visibleOpportunities = _.sortBy(visibleOpportunities, (o) => o.ice.e).reverse();
        break;
      case sortOrderKeys.alpha:
        visibleOpportunities = _.sortBy(visibleOpportunities, (o) => o.name);
        break;
      default:
        // don't do anything already doing match.
    }
    return visibleOpportunities;
  },
  sortOrder() {
    return Template.instance().sortOrder;
  },
  typeCourse() {
    return this.type === 'courses';
  },
  toUpper(string) {
    return string.toUpperCase();
  },
});

Template.Card_Explorer_Opportunities_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance()
      .hidden
      .set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance()
      .hidden
      .set(true);
  },
});

Template.Card_Explorer_Opportunities_Widget.onRendered(function cardExplorerOpportunitiesWidgetOnRendered() {
  if (getUserIdFromRoute()) {
    const profile = Users.getProfile(getUserIdFromRoute());
    // console.log(profile);
    if (profile.opportunityExplorerSortOrder) {
      Template.instance()
        .sortOrder
        .set(profile.opportunityExplorerSortOrder);
    }
  }
});
