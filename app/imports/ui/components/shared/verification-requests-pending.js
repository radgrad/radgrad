import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

// /** @module ui/components/shared/Verification_Requests_Pending */

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
    const group = FlowRouter.current().route.group.name;
    const openRequests = VerificationRequests.find({ status: VerificationRequests.OPEN }).fetch();
    if (group === 'faculty') {
      return _.filter(openRequests, (request) => {
        const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
        return Opportunities.findDoc(oi.opportunityID).sponsorID === getUserIdFromRoute();
      });
    }
    return openRequests;
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
      OpportunityInstances.updateVerified(request.opportunityInstanceID, true);
      const opportunities = OpportunityInstances.find({
        studentID: VerificationRequests.getStudentDoc(request._id)._id,
        opportunityID: VerificationRequests.getOpportunityDoc(request._id)._id,
      }).fetch();
      const timestamp = new Date().getTime();
      const opportunityID = VerificationRequests.getOpportunityDoc(request._id)._id;
      if (Feeds.checkPastDayFeed(timestamp, 'verified-opportunity', opportunityID)) {
        Feeds.updateVerifiedOpportunity(VerificationRequests.getStudentDoc(request._id).username,
            Feeds.checkPastDayFeed(timestamp, 'verified-opportunity', opportunityID));
      } else {
        const feedDefinition = {
          user: [VerificationRequests.getStudentDoc(request._id).username],
          opportunity: Slugs.findDoc(VerificationRequests.getOpportunityDoc(request._id).slugID),
          semester: Slugs.findDoc(Semesters.findDoc(opportunities[0].semesterID).slugID),
          feedType: 'verified-opportunity',
          timestamp,
        };
        Feeds.defineNewVerifiedOpportunity(feedDefinition);
      }
    } else {
      request.status = VerificationRequests.REJECTED;
      processRecord.status = VerificationRequests.REJECTED;
      OpportunityInstances.updateVerified(request.opportunityInstanceID, false);
    }
    processRecord.verifier = Users.getFullName(Meteor.userId());
    processRecord.feedback = event.target.parentElement.querySelectorAll('input')[0].value;
    request.processed.push(processRecord);
    const status = request.status;
    const processed = request.processed;
    VerificationRequests.updateStatus(requestID, status, processed);
  },
});

Template.Verification_Requests_Pending.onRendered(function pendingVerificationRequestsOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
