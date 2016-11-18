import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { moment } from 'meteor/momentjs:moment';

Template.Verification_Requests_Completed.helpers({
  completedVerifications() {
    return VerificationRequests.find({ status: { $ne: VerificationRequests.OPEN } });
  },
  opportunityName(verification) {
    return VerificationRequests.getOpportunityDoc(verification._id).name;
  },
  ownerName(verification) {
    const sponsor = VerificationRequests.getSponsorDoc(verification._id);
    return Users.getFullName(sponsor._id);
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
    return Users.getFullName(student._id);
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
    VerificationRequests.updateStatus(id, status, processed);
  },
});

Template.Verification_Requests_Completed.onCreated(function completedVerificationRequestsOnCreated() {
  // this.autorun(() => {
  //   this.subscribe(VerificationRequests.getPublicationName());
  //   this.subscribe(Courses.getPublicationName());
  //   this.subscribe(CourseInstances.getPublicationName());
  //   this.subscribe(Opportunities.getPublicationName());
  //   this.subscribe(OpportunityInstances.getPublicationName());
  //   this.subscribe(Semesters.getPublicationName());
  //   this.subscribe(Users.getPublicationName());
  // });
});

Template.Verification_Requests_Completed.onRendered(function completedVerificationRequestsOnRendered() {
  // this.$('.dropdown').dropdown({
  //   // action: 'select',
  // });
});
