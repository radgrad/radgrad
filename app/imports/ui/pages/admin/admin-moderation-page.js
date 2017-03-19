import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

Template.Admin_Moderation_Page.onCreated(function onCreated() {
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  // this.subscribe(Courses.getPublicationName());
  // this.subscribe(Opportunities.getPublicationName());
  // this.subscribe(Semesters.getPublicationName());
  // this.subscribe(Users.getPublicationName());
});
