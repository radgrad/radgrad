import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { processPendingVerificationMethod } from '../../../api/verification/VerificationRequestCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { updateLevelMethod } from '../../../api/level/LevelProcessor.methods';
import { getGroupName } from './route-group-name';

Template.Verification_Requests_Pending.helpers({
  opportunityName(request) {
    try {
      const opportunity = VerificationRequests.getOpportunityDoc(request._id);
      return opportunity.name;
    } catch (e) {
      return 'Retired Opportunity';
    }
  },
  ownerName(request) {
    try {
      const sponsor = VerificationRequests.getSponsorDoc(request._id);
      return Users.getFullName(sponsor.userID);
    } catch (e) {
      return '';
    }
  },
  pendingRequests() {
    const group = getGroupName();
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
    const verificationRequestID = split[0];
    const command = split[1];
    const feedback = $(`#${verificationRequestID}-feedback`).val();
    processPendingVerificationMethod.call({ verificationRequestID, command, feedback }, (error, result) => {
      if (result) {
        const student = VerificationRequests.getStudentDoc(verificationRequestID);
        // console.log('updating level', student);
        updateLevelMethod.call({ studentID: student.userID }, (err) => {
          if (err) {
            console.log(`Error updating ${student._id} level ${err.message}`);
          }
        });
      }
    });
  },
});

Template.Verification_Requests_Pending.onRendered(function pendingVerificationRequestsOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
