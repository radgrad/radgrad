import { Template } from 'meteor/templating';

import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';

Template.Landing_Section_2.onCreated(function landingSection2OnCreated() {
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
});

Template.Landing_Section_2.helpers({
  reviewsCount() {
    return Reviews.find().count();
  },
  interestsCount() {
    return Interests.find().count();
  },
  opportunitiesCount() {
    return Opportunities.find().count();
  },
  careerGoalsCount() {
    return CareerGoals.find().count();
  },
  usersCount() {
    return Users.find().count();
  },
});

Template.Landing_Section_2.events({
  // add your events here
});

Template.Landing_Section_2.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Section_2.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_2.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});

