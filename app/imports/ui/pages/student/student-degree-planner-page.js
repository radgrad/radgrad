import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { SessionState, sessionKeys } from '../../../startup/client/session-state';
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
  if (sessionStorage.CURRENT_STUDENT_ID) { // eslint-disable-line no-undef
    // eslint-disable-next-line no-undef
    SessionState.set(sessionKeys.CURRENT_STUDENT_ID, sessionStorage.CURRENT_STUDENT_ID);
  }
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
    const studentID = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    if (studentID) {
      const user = Users.findDoc(studentID);
      return {
        currentSemesterID: Semesters.getCurrentSemester(),
        studentUserName: user.username,
      };
    }
    console.log('There is a problem. CURRENT_STUDENT_ID should be set.');
    return null;
  },
});


Template.Student_Degree_Planner_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
