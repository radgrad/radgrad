import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { VerificationRequests } from './VerificationRequestCollection';
import { Feeds } from '../feed/FeedCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';

/** @module api/verification/VerificationRequestCollectionMethods */

/**
 * The ValidatedMethod for updating the status of VerificationRequests.
 */
export const verificationRequestsUpdateStatusMethod = new ValidatedMethod({
  name: 'VerificationRequests.updateStatus',
  validate: null,
  run(update) {
    // Verify that currently logged in user is an admin, advisor, or faculty. otherwise no update can occur.
    VerificationRequests._assertRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
    return VerificationRequests.updateStatus(update.id, update.status, update.processed);
  },
});


/**
 * Returns the opportunityInstanceID associated with the student and opportunity, or null if not found.
 * @param student The student.
 * @param opportunity The opportunity.
 * @param semester The semester
 * @returns The opportunityInstanceID, or null if it wasn't found.
 */
function getOpportunityInstanceID(student, opportunity, semester) {
  const studentID = Users.getID(student);
  const opportunityID = Opportunities.getID(opportunity);
  const semesterID = Semesters.getID(semester);
  const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID, semesterID }).fetch();
  return (opportunityInstances.length > 0) ? opportunityInstances[0]._id : null;
}

/**
 * This Meteor Method processes a request to verify an opportunity for a given user in the Admin Verify Event page.
 * The method is passed a student, opportunity, and semester, which should normally be valid.
 * Processing this request involves the following:
 *   * If the student does not have an Opportunity Instance for this opportunity and semester, then one is created
 *     for them.
 *   * If the student has not already submitted a Verification Request for their Opportunity Instance, then one is
 *     created for them.
 *   * If the student has already been verified for this Opportunity, then nothing more is done.
 *   * Once the OpportunityInstance and VerificationRequest exist, then they are updated to indicate that they have
 *     been verified if they are not already verified.
 *   * A status string is returned to the caller to indicate the result of processing.
 * Only admins and advisors can perform this action.
 */
export const processVerificationEventMethod = new ValidatedMethod({
  name: 'VerificationRequests.processVerificationEvent',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ student, opportunity, semester }) {
    // Define a string to hold the result of this process.
    let resultMessage = '';

    // Verify that currently logged in user is an admin, advisor, or faculty. otherwise no verification can occur.
    VerificationRequests._assertRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);

    // Make sure there's an opportunity instance for this student.
    let opportunityInstanceID = getOpportunityInstanceID(student, opportunity, semester);
    if (!opportunityInstanceID) {
      resultMessage += '  No opportunity instance found. Defining a new one.\n';
      opportunityInstanceID = OpportunityInstances.define({ semester, opportunity, student });
    }

    // Make sure there's a verification request for this opportunity instance.
    let verificationRequestID = VerificationRequests.findOne({ opportunityInstanceID });
    if (!verificationRequestID) {
      resultMessage += '  No verification request found. Defining a new one.\n';
      verificationRequestID = VerificationRequests.define({ student, opportunityInstance: opportunityInstanceID });
    }

    // If this event has already been verified, then return now.
    if (OpportunityInstances.findDoc(opportunityInstanceID).verified) {
      return `  Event ${opportunity.name} is already verified for ${student}`;
    }

    // Otherwise verify the opportunity instance and the VerificationRequestID.
    resultMessage += '  Setting the opportunity instance and verification request to verified.\n';
    OpportunityInstances.update(opportunityInstanceID, { verified: true });
    VerificationRequests.setVerified(verificationRequestID, Meteor.userId());

    // Create a Feed entry for this verification event.
    resultMessage += '  Creating a feed entry.\n';
    Feeds.define({ feedType: 'verified-opportunity', user: student, opportunity, semester });

    return resultMessage;
  },
});
