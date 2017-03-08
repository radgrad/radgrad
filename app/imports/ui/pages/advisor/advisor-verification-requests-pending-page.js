import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Advisor_Verification_Requests_Pending_Page.helpers({
  // add you helpers here
});

Template.Advisor_Verification_Requests_Pending_Page.events({
  // add your events here
});

Template.Advisor_Verification_Requests_Pending_Page.onCreated(function advisorVerificationRequestsPendingOnCreated() {
  this.subscribe(VerificationRequests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Advisor_Verification_Requests_Pending_Page.onRendered(function advisorVerificationRequestsPendOnRendered() {
});

Template.Advisor_Verification_Requests_Pending_Page.onDestroyed(function advisorVerificationRequestsPendOnDestroyed() {
  // add your statement here
});

