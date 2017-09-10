import { Template } from 'meteor/templating';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Landing_Layout.onCreated(function landingBodyOnCreated() {
  this.subscribe(PublicStats.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(AcademicPlans.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

