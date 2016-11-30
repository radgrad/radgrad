// import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
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
  updateSessionState(SessionState);
  if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
  }
  this.autorun(() => {
    this.subscribe(CareerGoals.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Advisor_Student_Configuration_Page.onRendered(function advisorStudentConfirgurationPageOnRendered() {

});
