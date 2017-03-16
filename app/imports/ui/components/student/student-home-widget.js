import { Template } from 'meteor/templating';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';


Template.Student_Home_Widget.onCreated(function studentHomeWidgetOnCreated() {
  this.subscribe(Feeds.getPublicationName());
  this.subscribe(Teasers.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(3), getUserIdFromRoute());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName(3), getUserIdFromRoute());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_Home_Widget.helpers({
});

Template.Student_Home_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
