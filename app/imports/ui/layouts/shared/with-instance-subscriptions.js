import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection.js';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

/* eslint-disable object-shorthand */

// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

Template.With_Instance_Subscriptions.onCreated(function withInstanceSubscriptionsOnCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  // console.log('With_Instance_Subscriptions', getUserIdFromRoute());
  this.autorun(function () {
    const userID = getUserIdFromRoute();
    if (userID) {  // if logged out don't subscribe
      // get your information
      instanceSubs.subscribe(AcademicYearInstances.getPublicationName(), userID);
      instanceSubs.subscribe(AdvisorLogs.getPublicationName(), userID);
      instanceSubs.subscribe(CourseInstances.getPublicationName(), userID);
      instanceSubs.subscribe(FavoriteAcademicPlans.getPublicationName(), userID);
      instanceSubs.subscribe(FavoriteCareerGoals.getPublicationName(), userID);
      instanceSubs.subscribe(FavoriteCourses.getPublicationName(), userID);
      instanceSubs.subscribe(FavoriteInterests.getPublicationName(), userID);
      instanceSubs.subscribe(FavoriteOpportunities.getPublicationName(), userID);
      instanceSubs.subscribe(FeedbackInstances.getPublicationName(), userID);
      instanceSubs.subscribe(OpportunityInstances.getPublicationName(), userID);
      instanceSubs.subscribe(VerificationRequests.getPublicationName(), userID);
    }
    // get public information
    self.ready.set(instanceSubs.ready());
  });
});

Template.With_Instance_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
