import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { moment } from 'meteor/momentjs:moment';


Template.Verification_Requests_Pending.helpers({
  opportunityName(request) {
    const opportunity = VerificationRequests.getOpportunityDoc(request._id);
    return opportunity.name;
  },
  ownerName(request) {
    const sponsor = VerificationRequests.getSponsorDoc(request._id);
    return Users.getFullName(sponsor._id);
  },
  pendingRequests() {
    return VerificationRequests.find({ status: VerificationRequests.OPEN });
  },
  processedDate(date) {
    const processed = moment(date);
    return processed.calendar();
  },
  semesterString(request) {
    const semester = VerificationRequests.getSemesterDoc(request._id);
    return Semesters.toString(semester._id, false);
  },
  studentName(request) {
    const student = VerificationRequests.getStudentDoc(request._id);
    return Users.getFullName(student._id);
  },
  whenSubmitted(request) {
    const submitted = moment(request.submittedOn);
    return submitted.calendar();
  },
});

Template.Verification_Requests_Pending.events({
  'click button': function clickButton(event) {
    event.preventDefault();
    const split = event.target.id.split('-');
    const requestID = split[0];
    const request = VerificationRequests.findDoc(requestID);
    const processRecord = {};
    processRecord.date = new Date();
    if (split[1] === 'accept') {
      request.status = VerificationRequests.ACCEPTED;
      processRecord.status = VerificationRequests.ACCEPTED;
      Meteor.call('Collection.update', {
        collectionName: 'OpportunityInstances',
        id: request.opportunityInstanceID,
        modifier: { verified: true },
      });
    } else {
      request.status = VerificationRequests.REJECTED;
      processRecord.status = VerificationRequests.REJECTED;
      Meteor.call('Collection.update', {
        collectionName: 'OpportunityInstances',
        id: request.opportunityInstanceID,
        modifier: { verified: false },
      });
    }
    processRecord.verifier = Users.getFullName(Meteor.userId());
    processRecord.feedback = event.target.parentElement.querySelectorAll('input')[0].value;
    request.processed.push(processRecord);
    const status = request.status;
    const processed = request.processed;
    Meteor.call('Collection.update', {
      collectionName: 'VerificationRequests',
      id: requestID,
      modifier: { status, processed },
    });
  },
});

Template.Verification_Requests_Pending.onCreated(function pendingVerificationRequestsOnCreated() {

});

Template.Verification_Requests_Pending.onRendered(function pendingVerificationRequestsOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
