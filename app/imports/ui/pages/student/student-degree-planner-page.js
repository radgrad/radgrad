import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Student_Degree_Planner_Page.onCreated(function plannerOnCreated() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Student_Degree_Planner_Page.onRendered(function plannerOnRendered() {
  Accounts._loginButtonsSession.set('dropdownVisible', true);
});

Template.Student_Degree_Planner_Page.helpers({
  args() {
    return {
      currentSemesterID: Semesters.getCurrentSemester(),
      studentUserName: Meteor.user().username,
    };
  },
});


Template.Student_Degree_Planner_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
