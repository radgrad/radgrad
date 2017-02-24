import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Faculty_Home_Page.onCreated(function appBodyOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Faculty_Home_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Faculty_Home_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
