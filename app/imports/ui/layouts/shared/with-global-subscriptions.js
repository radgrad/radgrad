import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';

/* eslint-disable object-shorthand */

/*
 For details on this approach, see:
 https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/using-subs-manager

 https://github.com/kadirahq/subs-manager
*/

// cacheLimit default is 10, so increased to handle 13 subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

Template.With_Global_Subscriptions.onCreated(function onCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    globalSubs.subscribe(CareerGoals.getPublicationName());
    globalSubs.subscribe(Courses.getPublicationName());
    globalSubs.subscribe(DesiredDegrees.getPublicationName());
    globalSubs.subscribe(Feedbacks.getPublicationName());
    globalSubs.subscribe(HelpMessages.getPublicationName());
    globalSubs.subscribe(Interests.getPublicationName());
    globalSubs.subscribe(InterestTypes.getPublicationName());
    globalSubs.subscribe(MentorProfiles.getPublicationName());
    globalSubs.subscribe(Opportunities.getPublicationName());
    globalSubs.subscribe(OpportunityTypes.getPublicationName());
    globalSubs.subscribe(Reviews.getPublicationName());
    globalSubs.subscribe(Semesters.getPublicationName());
    globalSubs.subscribe(Slugs.getPublicationName());
    globalSubs.subscribe(Teasers.getPublicationName());
    globalSubs.subscribe(Users.getPublicationName());
    self.ready.set(globalSubs.ready());
  });
});

Template.With_Global_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
