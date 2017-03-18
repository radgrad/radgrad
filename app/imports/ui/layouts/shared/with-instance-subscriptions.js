import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ expireIn: 30 });

Template.With_Instance_Subscriptions.onCreated(function withInstanceSubscriptionsOnCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    instanceSubs.subscribe(AcademicYearInstances.getPublicationName(1), getUserIdFromRoute());
    instanceSubs.subscribe(CourseInstances.getPublicationName(5), getUserIdFromRoute());
    instanceSubs.subscribe(FeedbackInstances.getPublicationName());
    instanceSubs.subscribe(OpportunityInstances.getPublicationName(3), getUserIdFromRoute());
    instanceSubs.subscribe(VerificationRequests.getPublicationName());
    self.ready.set(instanceSubs.ready());
  });
});

Template.With_Instance_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
