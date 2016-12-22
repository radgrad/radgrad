import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Opportunities_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());

});
});

Template.Student_Opportunities_Of_Interest_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  opportunityInterests(opp) {
    const ret = [];
    if (getRouteUserName()) {
      const opportunity = opp;
      _.map(opportunity.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
    });
    }
    return ret;
  },
  userInterests() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
    });
    }
    return ret;
  },
  opportunities() {
    const allOpportunities = Opportunities.find().fetch();
    const matchingOpportunities = [];
    const user = Users.findDoc({ username: getRouteUserName() });
    const userInterests = [];
    let opportunityInterests = [];
    _.map(user.interestIDs, (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.map(allOpportunities, (opp) => {
      opportunityInterests = [];
      _.map(opp.interestIDs, (id) => {
        opportunityInterests.push(Interests.findDoc(id));
        _.map(opportunityInterests, (oppInterest) => {
          _.map(userInterests, (userInterest) => {
            if (_.isEqual(oppInterest, userInterest)) {
              if (!_.includes(matchingOpportunities, opp)) {
                matchingOpportunities.push(opp);
              }
            }
          });
        });
      });
    });
    return matchingOpportunities;
  },
  opportunityCount() {
    return Opportunities.find().count();
  },
});


Template.Student_Opportunities_Of_Interest_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Opportunities_Of_Interest_Widget.onRendered({});
