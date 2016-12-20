// import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { StarDataLogs } from '../../../api/star/StarDataLogCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Advisor_Student_Configuration_Page.helpers({
  getDictionary() {
    return Template.instance().state;
  },
});

Template.Advisor_Student_Configuration_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Advisor_Student_Configuration_Page.onCreated(function advisorStudentConfirgurationPageOnCreated() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(CareerGoals.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(OpportunityTypes.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(StarDataLogs.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Advisor_Student_Configuration_Page.onRendered(function advisorStudentConfirgurationPageOnRendered() {

});
