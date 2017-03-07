import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Advisor_Completed_Verifications_Page.helpers({
  // add you helpers here
});

Template.Advisor_Completed_Verifications_Page.events({
  // add your events here
});

Template.Advisor_Completed_Verifications_Page.onCreated(
    function advisorVerificationRequestsCompletedOnCreated() {
      this.subscribe(VerificationRequests.getPublicationName());
      this.subscribe(Opportunities.getPublicationName());
      this.subscribe(OpportunityInstances.getPublicationName());
      this.subscribe(Semesters.getPublicationName());
      this.subscribe(Users.getPublicationName());
    }
);

Template.Advisor_Completed_Verifications_Page.onRendered(
    function advisorVerificationRequestsCompletedOnRendered() {
    });

Template.Advisor_Completed_Verifications_Page.onDestroyed(
    function advisorVerificationRequestsCompletedOnDestroyed() {
      // add your statement here
    });

