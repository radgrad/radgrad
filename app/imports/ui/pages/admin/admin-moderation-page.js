import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Admin_Moderation_Page.helpers({
  // add you helpers here
});

Template.Admin_Moderation_Page.events({
  // add your events here
});

Template.Admin_Moderation_Page.onCreated(function adminModerationPageOnCreated() {
  this.autorun(() => {
    this.subscribe(Reviews.getPublicationName());
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Admin_Moderation_Page.onRendered(function adminModerationPageOnRendered() {
});

Template.Admin_Moderation_Page.onDestroyed(function adminModerationPageOnDestroyed() {
  // add your statement here
});

