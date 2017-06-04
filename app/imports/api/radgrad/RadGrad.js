import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection.js';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection.js';
import { CourseInstances } from '../course/CourseInstanceCollection.js';
import { Feeds } from '../feed/FeedCollection.js';
import { Feedbacks } from '../feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection.js';
import { HelpMessages } from '../help/HelpMessageCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection.js';
import { InterestTypes } from '../interest/InterestTypeCollection.js';
import { MentorAnswers } from '../mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../mentor/MentorProfileCollection.js';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection.js';
import { PlanChoices } from '../degree-plan/PlanChoiceCollection';
import { PublicStats } from '../public-stats/PublicStatsCollection';
import { Reviews } from '../review/ReviewCollection';
import { Semesters } from '../semester/SemesterCollection.js';
import { Slugs } from '../slug/SlugCollection.js';
import { Teasers } from '../teaser/TeaserCollection';
import { Users } from '../user/UserCollection';
import { ValidUserAccounts } from '../user/ValidUserAccountCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection.js';

/** @module api/radgrad/RadGrad */

class RadGradClass {

  constructor() {
    /**
     * A list of all RadGrad API collections in alphabetical order.
     */
    this.collections = [
      AcademicPlans,
      AcademicYearInstances,
      AdvisorLogs,
      CareerGoals,
      Courses,
      CourseInstances,
      Feeds,
      Feedbacks,
      FeedbackInstances,
      HelpMessages,
      DesiredDegrees,
      Interests,
      InterestTypes,
      MentorAnswers,
      MentorQuestions,
      MentorProfiles,
      Opportunities,
      OpportunityInstances,
      OpportunityTypes,
      PlanChoices,
      PublicStats,
      Reviews,
      Semesters,
      Slugs,
      Teasers,
      Users,
      ValidUserAccounts,
      VerificationRequests,
    ];

    /**
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     * Note that some collection class instances are implicitly initialized: Slugs, AcademicYearInstancs, and
     * PublicStats.
     */
    this.collectionLoadSequence = [
      Semesters,
      HelpMessages,
      InterestTypes,
      Interests,
      CareerGoals,
      DesiredDegrees,
      ValidUserAccounts,
      Users,
      OpportunityTypes,
      Opportunities,
      Courses,
      Feedbacks,
      Teasers,
      CourseInstances,
      OpportunityInstances,
      FeedbackInstances,
      VerificationRequests,
      Feeds,
      AdvisorLogs,
      MentorProfiles,
      MentorQuestions,
      MentorAnswers,
      Reviews,
      AcademicPlans,
      PlanChoices,
    ];

    /**
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    _.forEach(this.collections, collection => {
      this.collectionAssociation[collection._collectionName] = collection;
    });
  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called RadGrad.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const RadGrad = new RadGradClass();
