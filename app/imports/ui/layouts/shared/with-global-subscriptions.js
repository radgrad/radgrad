import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

/* eslint-disable object-shorthand */

/*
 For details on this approach, see:
 https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/using-subs-manager

 https://github.com/kadirahq/subs-manager
*/

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 31, expireIn: 30 });

Template.With_Global_Subscriptions.onCreated(function onCreated() {
  console.trace('with global subs');
  const self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    globalSubs.subscribe(AcademicPlans.getPublicationName());
    globalSubs.subscribe(AdvisorProfiles.getPublicationName());
    globalSubs.subscribe(CareerGoals.getPublicationName());
    globalSubs.subscribe(CourseInstances.publicationNames.scoreboard);
    globalSubs.subscribe(Courses.getPublicationName());
    globalSubs.subscribe(DesiredDegrees.getPublicationName());
    globalSubs.subscribe(FacultyProfiles.getPublicationName());
    globalSubs.subscribe(FavoriteAcademicPlans.publicationNames.scoreboard);
    globalSubs.subscribe(FavoriteCareerGoals.publicationNames.scoreboard);
    globalSubs.subscribe(FavoriteCourses.publicationNames.scoreboard);
    globalSubs.subscribe(FavoriteInterests.publicationNames.scoreboard);
    globalSubs.subscribe(FavoriteOpportunities.publicationNames.scoreboard);
    globalSubs.subscribe(Feeds.getPublicationName());
    globalSubs.subscribe(HelpMessages.getPublicationName());
    globalSubs.subscribe(Interests.getPublicationName());
    globalSubs.subscribe(InterestTypes.getPublicationName());
    globalSubs.subscribe(MentorAnswers.getPublicationName());
    globalSubs.subscribe(MentorProfiles.getPublicationName());
    globalSubs.subscribe(MentorQuestions.getPublicationName());
    globalSubs.subscribe(Opportunities.getPublicationName());
    globalSubs.subscribe(OpportunityInstances.publicationNames.scoreboard);
    globalSubs.subscribe(OpportunityTypes.getPublicationName());
    globalSubs.subscribe(PlanChoices.getPublicationName());
    globalSubs.subscribe(Reviews.getPublicationName());
    globalSubs.subscribe(Semesters.getPublicationName());
    globalSubs.subscribe(StudentParticipation.getPublicationName());
    globalSubs.subscribe(StudentProfiles.getPublicationName());
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
