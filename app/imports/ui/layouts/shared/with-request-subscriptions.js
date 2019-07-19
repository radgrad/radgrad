import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

/* eslint-disable object-shorthand */

// expireLimit set to 30 minutes because: why not.
const requestSubs = new SubsManager({ cacheLimit: 5, expireIn: 30 });


Template.With_Request_Subscriptions.onCreated(function withRequestSubscriptionsOnCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  this.autorun(function () {
    const requests = VerificationRequests.find({}).fetch();
    const studentIDs = _.uniq(_.map(requests, (r) => r.studentID));
    requestSubs.subscribe(OpportunityInstances.publicationNames.verification, studentIDs);
    self.ready.set(requestSubs.ready());
  });
});

Template.With_Request_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
