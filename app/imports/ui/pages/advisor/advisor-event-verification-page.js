import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Advisor_Event_Verification_Page.helpers({
  // add you helpers here
});

Template.Advisor_Event_Verification_Page.events({
  // add your events here
});

Template.Advisor_Event_Verification_Page.onCreated(function advisorEventVerificationPageOnCreated() {
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
});

Template.Advisor_Event_Verification_Page.onRendered(function advisorEventVerificationPageOnRendered() {
  // add your statement here
});

Template.Advisor_Event_Verification_Page.onDestroyed(function advisorEventVerificationPageOnDestroyed() {
  // add your statement here
});

