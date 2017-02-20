import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Mentor_Home_Page.onCreated(function appBodyOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Mentor_Home_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Mentor_Home_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
