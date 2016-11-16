import { Template } from 'meteor/templating';
import { VerificationRequests } from '/imports/api/verification/VerificationRequestCollection.js';

Template.Verification_Requests_Completed.helpers({
  completedVerifications() {
    return [
      {
        id: 'id1',
        opportunityName: 'OPQ Research Project',
        semesterString: 'Summer 2016',
        studentName: 'Abigail Kealoha',
        ownerName: 'Philip Johnson',
        submittedOn: 'October 1',
        processed: [
          {
            date: 'October 8',
            by: 'Gerald Lau',
            status: VerificationRequests.ACCEPTED,
          },
        ],
      },
      {
        id: 'id2',
        opportunityName: 'Live Action Internship',
        semesterString: 'Summer 2016',
        studentName: 'Fenton Maluhia',
        ownerName: 'Gerald Lau',
        submittedOn: 'October 1',
        processed: [
          {
            date: 'October 11',
            by: 'Philip Johnson',
            status: VerificationRequests.REJECTED,
          },
          {
            date: 'October 12',
            by: 'Philip Johnson',
            status: VerificationRequests.ACCEPTED,
          },
        ],
      },
    ];
  },
  opportunityName(verification) {
    return verification.opportunityName;
  },
  opportunitySemester(verification) {
    return verification.semesterString;
  },
});

Template.Verification_Requests_Completed.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Verification_Requests_Completed.onCreated(function completedVerificationRequestsOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Verification_Requests_Completed.onRendered(function completedVerificationRequestsOnRendered() {
  // this.$('.dropdown').dropdown({
  //   // action: 'select',
  // });
});
