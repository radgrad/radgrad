import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { verificationRequestsUpdateStatusMethod }
  from '../../../api/verification/VerificationRequestCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getGroupName } from './route-group-name';

Template.Verification_Requests_Completed.helpers({
  completedVerifications() {
    const group = getGroupName();
    const openRequests = VerificationRequests.find({ status: { $ne: VerificationRequests.OPEN } },
      { sort: { submittedOn: -1 } })
      .fetch();
    if (group === 'faculty') {
      return _.filter(openRequests, (request) => {
        const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
        return Opportunities.findDoc(oi.opportunityID).sponsorID === getUserIdFromRoute();
      });
    }
    return openRequests;
  },
  opportunityName(verification) {
    try {
      return VerificationRequests.getOpportunityDoc(verification._id).name;
    } catch (e) {
      return 'Retired Opportunity';
    }
  },
  ownerName(verification) {
    try {
      const sponsor = VerificationRequests.getSponsorDoc(verification._id);
      return Users.getFullName(sponsor.userID);
    } catch (e) {
      return '';
    }
  },
  processedDate(date) {
    const processed = moment(date);
    return processed.calendar();
  },
  semesterString(verification) {
    const semester = VerificationRequests.getSemesterDoc(verification._id);
    return Semesters.toString(semester._id, false);
  },
  studentName(verification) {
    const student = VerificationRequests.getStudentDoc(verification._id);
    return Users.getFullName(student.userID);
  },
  whenSubmitted(verification) {
    const submitted = moment(verification.submittedOn);
    return submitted.calendar();
  },
});

Template.Verification_Requests_Completed.events({
  'click button': function clickButton(event) {
    event.preventDefault();
    const id = event.target.id;
    const request = VerificationRequests.findDoc(id);
    const status = VerificationRequests.OPEN;
    const processRecord = {};
    processRecord.date = new Date();
    processRecord.status = VerificationRequests.OPEN;
    processRecord.verifier = Users.getFullName(Meteor.userId());
    const processed = request.processed;
    processed.push(processRecord);
    verificationRequestsUpdateStatusMethod.call({ id, status, processed });
    // update the OpportunityInstance so that it isn't verified.
    const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
    const collectionName = OpportunityInstances.getCollectionName();
    const updateData = {
      id: oi._id,
      verified: false,
    };
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Failed to update the opportunity instance', error);
      }
    });
  },
});
