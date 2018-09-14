import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';

Template.Student_Card_Explorer_Opportunities_Widget.onCreated(function studentCardExplorerOppWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
});

const availableOpps = () => {
  const opps = Opportunities.find({}).fetch();
  const currentSemester = Semesters.getCurrentSemesterDoc();
  if (opps.length > 0) {
    const filteredBySem = _.filter(opps, function filter(opp) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opp._id,
      }).fetch();
      return oi.length === 0;
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
  }
  return [];
};

// TODO Can we move this code into some sort of helperFunction file? I've seen this a lot.
function matchingOpportunities() {
  const allOpportunities = availableOpps();
  const profile = Users.getProfile(getRouteUserName());
  const interestIDs = Users.getInterestIDs(profile.userID);
  const preferred = new PreferredChoice(allOpportunities, interestIDs);
  return preferred.getOrderedChoices();
}

function hiddenOpportunitiesHelper() {
  if (getRouteUserName()) {
    const opportunities = matchingOpportunities();
    let nonHiddenOpportunities;
    if (Template.instance().hidden.get()) {
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

Template.Student_Card_Explorer_Opportunities_Widget.helpers({
  hidden() {
    return Template.instance().hidden.get();
  },
  hiddenExists() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.hiddenOpportunityIDs.length !== 0;
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
    if (Template.instance().hidden.get()) {
      visibleOpportunities = hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  },
  typeCourse() {
    return this.type === 'courses';
  },
  toUpper(string) {
    return string.toUpperCase();
  },
});

Template.Student_Card_Explorer_Opportunities_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(true);
  },
});
