import { Template } from 'meteor/templating';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../api/user/UserCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

function numReferences() {
  return 0;
}

Template.List_Verification_Requests_Widget.helpers({
  verificationRequests() {
    return VerificationRequests.find({});
  },
  count() {
    return VerificationRequests.count();
  },
  deleteDisabled(verificationRequest) {
    return (numReferences(verificationRequest) > 0) ? 'disabled' : '';
  },
  name(vr) {
    const student = Users.getFullName(vr.studentID);
    const oi = OpportunityInstances.findDoc(vr.opportunityInstanceID);
    const semester = Semesters.toString(oi.semesterID, false);
    const opportunityName = OpportunityInstances.getOpportunityDoc(vr.opportunityInstanceID).name;
    return `${student}: ${opportunityName} - ${semester}`; // eslint-disable-line
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(vr) {
    return [
      { label: 'Student', value: `${Users.getFullName(vr.studentID)}` },
      { label: 'Opportunity',
        value: `${OpportunityInstances.getOpportunityDoc(vr.opportunityInstanceID).name}` },
      { label: 'Submitted on', value: vr.submittedOn.toString() },
      { label: 'Status', value: vr.status },
      { label: 'ICE', value: `${vr.ice.i}, ${vr.ice.c}, ${vr.ice.e}` },
    ];
  },
});

Template.List_Verification_Requests_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'TeaserCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
