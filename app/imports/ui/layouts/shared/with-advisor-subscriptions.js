import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { PlanChoices } from '/imports/api/degree-plan/PlanChoiceCollection';
import { StarDataLogs } from '/imports/api/star/StarDataLogCollection';

/* eslint-disable object-shorthand */

/*
 For details on this approach, see:
 https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/using-subs-manager

 https://github.com/kadirahq/subs-manager
 */

// cacheLimit default is 10, so increased to handle 13 subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

Template.With_Advisor_Subscriptions.onCreated(function withAdvisorSubscriptionsOnCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    globalSubs.subscribe(PlanChoices.getPublicationName());
    globalSubs.subscribe(StarDataLogs.getPublicationName());
    self.ready.set(globalSubs.ready());
  });
});

Template.With_Advisor_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
