import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { Feed } from '../../../api/feed/FeedCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { moment } from 'meteor/momentjs:moment';

Template.Verification_Event.helpers({
  events() {
    return Opportunities.find({ eventDate: { $exists: true } }).fetch();
  },
  eventDate(event) {
    const m = moment(event.eventDate);
    return m.format('MM/DD/YY');
  },
});

Template.Verification_Event.events({
  submit: function submit(event) {
    event.preventDefault();
    const opportunityID = event.target.elements[0].selectedOptions[0].value;
    const student = event.target.elements[1].value;
    const opportunity = Opportunities.findDoc(opportunityID);
    const opportunitySlug = Slugs.findDoc(opportunity.slugID).name;
    const semester = Semesters.getSemesterDoc(opportunity.eventDate);
    const semesterSlug = Slugs.findDoc(semester.slugID).name;
    try {
      const studentID = Users.getID(student);
      const studentDoc = Users.findDoc(studentID);
      const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID }).fetch();
      let opportunityInstance = null;
      if (opportunityInstances.length === 0) { // student didn't plan on attending in degree plan
        opportunityInstance = OpportunityInstances.define({ student, semester: semesterSlug,
          verified: true, opportunity: opportunitySlug });
      } else {
        opportunityInstance = opportunityInstances[0];
        OpportunityInstances.updateVerified(opportunityInstance._id, true);
      }
      const requestID = VerificationRequests.define({ student: studentDoc.username, opportunityInstance });
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
      VerificationRequests.updateStatus(requestID, status, processed);

      const feedDefinition = {
        student: studentID,
        opportunity: opportunityID,
        feedType: 'verified',
        timestamp: Date.now(),
      };
      Feed.define(feedDefinition);
    } catch (e) {
      alert(`${student} is not a valid student. ${e}`); // eslint-disable-line no-undef, no-alert
    }
  },
});

Template.Verification_Event.onCreated(function eventVerificationOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Verification_Event.onRendered(function eventVerificationOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
