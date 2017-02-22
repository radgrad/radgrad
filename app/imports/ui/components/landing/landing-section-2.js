import { Template } from 'meteor/templating';

import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

Template.Landing_Section_2.onCreated(function landingSection2OnCreated() {
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
});

Template.Landing_Section_2.helpers({
  careerGoalsCount() {
    const stat = PublicStats.findDoc({ key: PublicStats.careerGoalsTotalKey });
    return stat.value;
  },
  interestsCount() {
    const stat = PublicStats.findDoc({ key: PublicStats.interestsTotalKey });
    return stat.value;
  },
  opportunitiesCount() {
    const stat = PublicStats.findDoc({ key: PublicStats.opportunitiesProjectsTotalKey });
    return stat.value;
  },
  reviewsCount() {
    const stat = PublicStats.findDoc({ key: PublicStats.courseReviewsTotalKey });
    return stat.value;
  },
});

Template.Landing_Section_2.events({
  // add your events here
});

Template.Landing_Section_2.onCreated(function landingBodyOnCreated() {
  this.subscribe(PublicStats.getPublicationName());
});

Template.Landing_Section_2.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_2.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});

