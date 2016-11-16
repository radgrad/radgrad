import { Template } from 'meteor/templating';

Template.Verification_Requests_Pending.helpers({
  pendingRequests() {
    return [
      {
        id: 'id1',
        opportunityName: '2016 Hawaii Annual Code Challenge',
        semesterString: 'Fall 2016',
        studentName: 'Amy Takayesu',
        ownerName: 'Cam Moore',
        submittedOn: 'October 1',
        processed: [],
      },
    ];
  },
});

Template.Verification_Requests_Pending.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Verification_Requests_Pending.onCreated(function pendingVerificationRequestsOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Verification_Requests_Pending.onRendered(function pendingVerificationRequestsOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
