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
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';

/* eslint-disable object-shorthand */

/*
 For details on this approach, see:
 https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/using-subs-manager
 */

const GlobalSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

Template.With_Global_Subscriptions.onCreated(function onCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    const careerGoalsHandle = GlobalSubs.subscribe(CareerGoals.getPublicationName());
    const coursesHandle = GlobalSubs.subscribe(Courses.getPublicationName());
    const desiredDegreesHandle = GlobalSubs.subscribe(DesiredDegrees.getPublicationName());
    const feedbacksHandle = GlobalSubs.subscribe(Feedbacks.getPublicationName());
    const helpMessagesHandle = GlobalSubs.subscribe(HelpMessages.getPublicationName());
    const interestsHandle = GlobalSubs.subscribe(Interests.getPublicationName());
    const interestTypesHandle = GlobalSubs.subscribe(InterestTypes.getPublicationName());
    const opportunitiesHandle = GlobalSubs.subscribe(Opportunities.getPublicationName());
    const opportunityTypesHandle = GlobalSubs.subscribe(OpportunityTypes.getPublicationName());
    const semestersHandle = GlobalSubs.subscribe(Semesters.getPublicationName());
    const usersHandle = GlobalSubs.subscribe(Users.getPublicationName());
    self.ready.set(
        careerGoalsHandle.ready() &&
        coursesHandle.ready() &&
        desiredDegreesHandle.ready() &&
        feedbacksHandle.ready() &&
        helpMessagesHandle.ready() &&
        interestsHandle.ready() &&
        interestTypesHandle.ready() &&
        opportunitiesHandle.ready() &&
        opportunityTypesHandle.ready() &&
        semestersHandle.ready() &&
        usersHandle.ready()
    );
  });
});

Template.With_Global_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
