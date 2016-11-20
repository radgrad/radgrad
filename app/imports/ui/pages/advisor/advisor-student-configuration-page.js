import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

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
  let uhId = FlowRouter.getQueryParam('uhId');
  if (uhId.indexOf('-') === -1) {
    uhId = `${uhId.substring(0, 4)}-${uhId.substring(4, 8)}`;
  }
  this.state.set('uhId', uhId);

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

Template.Advisor_Student_Configuration_Page.onRendered(function advisorStudentConfirgurationPageOnRendered() {
  let uhId = FlowRouter.getQueryParam('uhId');
  if (uhId.indexOf('-') === -1) {
    uhId = `${uhId.substring(0, 4)}-${uhId.substring(4, 8)}`;
  }
  this.state.set('uhId', uhId);
});
