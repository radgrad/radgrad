import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import {
  verificationRequestsUpdateStatusMethod,
} from '../../../api/verification/VerificationRequestCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from './route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/shared/Verification_Requests_Pending */

Template.Verification_Requests_Pending.helpers({
  opportunityName(request) {
    const opportunity = VerificationRequests.getOpportunityDoc(request._id);
    return opportunity.name;
  },
  ownerName(request) {
    const sponsor = VerificationRequests.getSponsorDoc(request._id);
    return Users.getFullName(sponsor.userID);
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
    return Users.getFullName(student.userID);
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
    // TODO This is super busted and super hard to understand. Let's make API better so logic is simpler.
    // console.log('requestID', requestID);
    // console.log('request', request);
    const processRecord = {};
    processRecord.date = new Date();
    if (split[1] === 'accept') {
      request.status = VerificationRequests.ACCEPTED;
      processRecord.status = VerificationRequests.ACCEPTED;
      OpportunityInstances.updateVerified(request.opportunityInstanceID, true);
      const opportunities = OpportunityInstances.find({
        studentID: request.studentID,
        opportunityID: VerificationRequests.getOpportunityDoc(request._id)._id,
      }).fetch();
      const opportunityID = VerificationRequests.getOpportunityDoc(request._id)._id;
      if (Feeds.checkPastDayFeed(Feeds.VERIFIED_OPPORTUNITY, opportunityID)) {
        Feeds._updateVerifiedOpportunity(VerificationRequests.getStudentDoc(request._id).username,
            Feeds.checkPastDayFeed(Feeds.VERIFIED_OPPORTUNITY, opportunityID));
      } else {
        const feedData = {
          feedType: Feeds.VERIFIED_OPPORTUNITY,
          user: VerificationRequests.getStudentDoc(request._id).username,
          opportunity: Slugs.findDoc(VerificationRequests.getOpportunityDoc(request._id).slugID),
          semester: Slugs.findDoc(Semesters.findDoc(opportunities[0].semesterID).slugID),
        };
        defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
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
    verificationRequestsUpdateStatusMethod.call({ id: requestID, status, processed }, (error) => {
      if (error) {
        console.log('Error updating VerificationRequest status', error);
      }
      let message = `${getRouteUserName()}`;
      if (request.status === VerificationRequests.ACCEPTED) {
        message = `${message} accepted`;
      } else {
        message = `${message} rejected`;
      }
      message = `${message} ${VerificationRequests.getStudentDoc(request._id).username}'s verification request for`;
      message = `${message} opportunity ${VerificationRequests.getOpportunityDoc(request._id).name}`;
      message = `${message} with feedback ${processRecord.feedback}.`;
      appLog.info(message);
    });
  },
});

Template.Verification_Requests_Pending.onRendered(function pendingVerificationRequestsOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
