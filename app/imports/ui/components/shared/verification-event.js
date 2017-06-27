import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import {
  verificationRequestsDefineMethod,
  verificationRequestsUpdateStatusMethod,
} from '../../../api/verification/VerificationRequestCollection.methods';

// /** @module ui/components/shared/Verification_Event */

Template.Verification_Event.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.log = new ReactiveVar('Nothing to show here.');
});

Template.Verification_Event.helpers({
  events() {
    return Opportunities.find({ eventDate: { $exists: true } }).fetch();
  },
  eventDate(event) {
    const m = moment(event.eventDate);
    return m.format('MM/DD/YY');
  },
  logValue() {
    return Template.instance().log.get();
  },
});

/**
 * Appends the passed message to the reactive variable holding the log text.
 * @param instance The template instance.
 * @param message The message to be appended to the log.
 */
function appendToLog(instance, message) {
  instance.log.set(`${instance.log.get()}\n${message}`);
}

/**
 * Returns the opportunityInstanceID associated with the student and opportunity, or null if not found.
 * @param studentID The student.
 * @param opportunityID The opportunity.
 * @param semesterID The semester
 * @returns The opportunityInstanceID, or null if it wasn't found.
 */
function getOpportunityInstanceID(studentID, opportunityID, semesterID) {
  const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID, semesterID }).fetch();
  return (opportunityInstances) ? opportunityInstances[0]._id : null;
}

Template.Verification_Event.events({
  submit: function submit(event) {
    event.preventDefault();
    // Verify that an opportunity was selected.
    let opportunityID;
    let opportunity;
    try {
      opportunityID = event.target.elements[0].selectedOptions[0].value;
      opportunity = Opportunities.findDoc(opportunityID);
    } catch (e) {
      appendToLog(Template.instance(), 'Please select an opportunity.');
      return;
    }
    const opportunitySlug = Slugs.findDoc(opportunity.slugID).name;
    const semester = Semesters.getSemesterDoc(opportunity.eventDate);
    const semesterID = semester._id;
    const semesterSlug = Slugs.findDoc(semester.slugID).name;
    // Verify that the student username is valid.
    const student = event.target.elements[1].value;
    let studentID;
    try {
      studentID = Users.getID(student);
    } catch (e) {
      appendToLog(Template.instance(), `User ${student} not found.`);
      return;
    }

    // Check to see if the student had this opportunity in their degree plan already.
    let opportunityInstanceID = getOpportunityInstanceID(studentID, opportunityID, semesterID);

    if (opportunityInstanceID) {
      // Was in the plan, so update the opportunity and define a Verification Request.
      appendToLog(Template.instance(), `Updating pre-existing opportunity instance for ${student}`);
      const updateData = { id: opportunityInstanceID, verified: true };
      updateMethod.call({ collectionName: 'OpportunityInstanceCollection', updateData });
      const definitionData = { student, }
    }

    const studentDoc = Users.findDoc(studentID);
    const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID }).fetch();
    let opportunityInstance = null;
    if (opportunityInstances.length === 0) { // student didn't plan on attending in degree plan
      let collectionName = OpportunityInstances.getCollectionName();
      let definitionData = { student, semester: semesterSlug, verified: true, opportunity: opportunitySlug };
      defineMethod.call({ collectionName, definitionData }, (error, result) => {
        if (error) {
          console.log('Error defining OpportunityInstance', error);
        } else {
          collectionName = VerificationRequests.getCollectionName();
          definitionData = { student: studentDoc.username, opportunityInstance: result };
          defineMethod.call({ collectionName, definitionData },
              (err, res) => {
                if (err) {
                  console.log('Error defining VerificationRequest', err);
                } else {
                  const requestID = res;
                  const request = VerificationRequests.findDoc(requestID);
                  request.status = VerificationRequests.ACCEPTED;
                  const processRecord = {};
                  processRecord.date = new Date();
                  processRecord.status = VerificationRequests.ACCEPTED;
                  processRecord.verifier = Users.getFullName(Meteor.userId());
                  const studentFullName = Users.getFullName(studentDoc._id);
                  processRecord.feedback = `${studentFullName} attended ${opportunity.name}`;
                  request.processed.push(processRecord);
                  const status = VerificationRequests.ACCEPTED;
                  const processed = request.processed;
                  verificationRequestsUpdateStatusMethod.call({ requestID, status, processed }, (err1) => {
                    if (err1) {
                      console.log('Error updating VerificationRequest status', err1);
                    }
                  });
                  const feedData = {
                    feedType: 'verified-opportunity', user: studentDoc.username,
                    opportunity: opportunitySlug, semester: semesterSlug
                  };
                  defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
                }
              });
        }
      });
    } else {
      opportunityInstance = opportunityInstances[0];
      const updateData = { id: opportunityInstance._id, verified: true };
      updateMethod.call({ collectionName: 'OpportunityInstanceCollection', updateData });
      verificationRequestsDefineMethod.call({
        student: studentDoc.username,
        opportunityInstance,
      }, (error, result) => {
        if (error) {
          console.log('Error defining VerificationRequest', error);
        } else {
          const requestID = result;
          const request = VerificationRequests.findDoc(requestID);
          request.status = VerificationRequests.ACCEPTED;
          const processRecord = {};
          processRecord.date = new Date();
          processRecord.status = VerificationRequests.ACCEPTED;
          processRecord.verifier = Users.getFullName(Meteor.userId());
          const studentFullName = Users.getFullName(studentDoc._id);
          processRecord.feedback = `${studentFullName} attended ${opportunity.name}`;
          request.processed.push(processRecord);
          const status = VerificationRequests.ACCEPTED;
          const processed = request.processed;
          verificationRequestsUpdateStatusMethod.call({ requestID, status, processed }, (err) => {
            if (err) {
              console.log('Error updating VerificationRequest status', err);
            }
          });
          const feedData = {
            feedType: 'verified-opportunity', user: studentDoc.username,
            opportunity: opportunitySlug, semester: semesterSlug
          };
          defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
        }
      });
    }

  },
});

Template.Verification_Event.onRendered(function eventVerificationOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
