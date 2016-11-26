import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { SessionState, sessionKeys } from '../../../startup/client/session-state';
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

Template.Advisor_Student_Configuration_Page.onCreated(function aadvisorStudentConfirgurationPageOnCreated() {
  this.state = new ReactiveDict();
  if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {  // eslint-disable-line no-undef
    this.state.set('uhId', localStorage.getItem('uhId'));  // eslint-disable-line no-undef
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
  let uhId = FlowRouter.getQueryParam('uhId');
  if (uhId) {
    if (uhId.indexOf('-') === -1) {
      uhId = `${uhId.substring(0, 4)}-${uhId.substring(4, 8)}`;
    }
    this.state.set('uhId', uhId);
  }
});
