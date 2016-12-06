import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
// import { WorkInstances } from '../../../api/work/WorkInstanceCollection';


Template.Admin_DataModel_Page.helpers({
  // add you helpers here
});

Template.Admin_DataModel_Page.events({
  // add your events here
});

Template.Admin_DataModel_Page.onCreated(function adminCrudPageOnCreated() {
  // Need to subscribe to everything.
  this.autorun(() => {
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(CareerGoals.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(DesiredDegrees.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(OpportunityTypes.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Slugs.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
    // this.subscribe(WorkInstances.getPublicationName());
  });
});

Template.Admin_DataModel_Page.onRendered(function adminCrudPageOnRendered() {
  // add your statement here
});

Template.Admin_DataModel_Page.onDestroyed(function adminCrudPageOnDestroyed() {
  // add your statement here
});

