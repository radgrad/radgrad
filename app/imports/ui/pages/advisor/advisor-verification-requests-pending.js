import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

Template.advisor_Verification_Requests_Pending.helpers({
  // add you helpers here
});

Template.advisor_Verification_Requests_Pending.events({
  // add your events here
});

Template.advisor_Verification_Requests_Pending.onCreated(function advisorVerificationRequestsPendingOnCreated() {
  // add your statement here
});

Template.advisor_Verification_Requests_Pending.onRendered(function advisorVerificationRequestsPendingOnRendered() {
  this.autorun(() => {
    this.subscribe(VerificationRequests.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.advisor_Verification_Requests_Pending.onDestroyed(function advisorVerificationRequestsPendingOnDestroyed() {
  // add your statement here
});

