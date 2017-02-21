import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { sessionKeys } from '../../../startup/client/session-state';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Home_Ice_Page.helpers({
});

Template.Student_Home_Ice_Page.events({
  // add events here
});

Template.Student_Home_Ice_Page.onCreated(function studentHomeIcePageOnCreated() {
  this.state = new ReactiveDict();
  if (getUserIdFromRoute()) {
    this.state.set(sessionKeys.CURRENT_STUDENT_ID, getUserIdFromRoute());
  }
  this.autorun(() => {
    this.subscribe(AcademicYearInstances.getPublicationName());
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

Template.Student_Home_Ice_Page.onDestroyed(function studentHomeIcePageOnDestroyed() {
  // add your statement here
});

Template.Student_Home_Ice_Page.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title',
    },
    exclusive: false,
  });
});
