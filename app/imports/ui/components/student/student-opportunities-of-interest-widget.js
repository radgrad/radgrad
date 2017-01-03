import { Template } from 'meteor/templating';
import { _, lodash } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Semesters } from '../../../api/semester/SemesterCollection.js';

Template.Student_Opportunities_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

const availableOpps = () => {
  const opps = Opportunities.find({}).fetch();
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSemester = Semesters.findDoc(currentSemesterID);
  if (opps.length > 0) {
    const filteredBySem = lodash.filter(opps, function filter(opp) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opp._id,
      }).fetch();
      return oi.length === 0;
    });
    const filteredByInstance = lodash.filter(filteredBySem, function filter(opp) {
      let inFuture = false;
      _.map(opp.semesterIDs, (semID) => {
        const sem = Semesters.findDoc(semID);
        if (sem.sortBy >= currentSemester.sortBy) {
          inFuture = true;
        }
      });
      return inFuture;
    });
    return filteredByInstance;
  }
  return [];
};

function matchingOpportunities() {
  const allOpportunities = availableOpps();
  const matching = [];
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
            if (!_.includes(matching, opp)) {
              matching.push(opp);
            }
          }
        });
      });
    });
  });
  return matching;
}

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
    return matchingOpportunities();
  },
  opportunityCount() {
    return matchingOpportunities().length;
  },
});


Template.Student_Opportunities_Of_Interest_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Opportunities_Of_Interest_Widget.onRendered({});
