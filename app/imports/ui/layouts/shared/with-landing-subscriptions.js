import { ReactiveVar } from 'meteor/reactive-var';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';

/* eslint-disable object-shorthand */

const landingSubs = new SubsManager({ cacheLimit: 11, expireIn: 30 });

Template.With_Landing_Subscriptions.onCreated(function withlandingsubscriptionsOnCreated() {
  // console.log('WithLandingSubscriptions.onCreated')
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    landingSubs.subscribe(AcademicPlans.getPublicationName());
    landingSubs.subscribe(CareerGoals.getPublicationName());
    landingSubs.subscribe(Courses.getPublicationName());
    landingSubs.subscribe(Interests.getPublicationName());
    landingSubs.subscribe(InterestTypes.getPublicationName());
    landingSubs.subscribe(Opportunities.getPublicationName());
    landingSubs.subscribe(OpportunityTypes.getPublicationName());
    landingSubs.subscribe(Semesters.getPublicationName());
    landingSubs.subscribe(Slugs.getPublicationName());
    landingSubs.subscribe(Teasers.getPublicationName());
    self.ready.set(landingSubs.ready());
  });
});

Template.With_Landing_Subscriptions.helpers({
  subsReady: function () {
    // console.log('landing ready', Template.instance().ready.get(), Slugs.count());
    return Template.instance().ready.get();
  },
});
