import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { HelpMessages } from '../help/HelpMessageCollection';
import { IceSnapshots } from '../analytic/IceSnapshotCollection';
import { Interests } from '../interest/InterestCollection';
import { InterestTypes } from '../interest/InterestTypeCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { MentorProfiles } from '../user/MentorProfileCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { PlanChoices } from '../degree-plan/PlanChoiceCollection';
import { PublicStats } from '../public-stats/PublicStatsCollection';
import { Reviews } from '../review/ReviewCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/**
 * @memberOf api/radgrad
 */
class RadGradClass {

  constructor() {
    /**
     * A list of all RadGrad API collections in alphabetical order.
     * This list is used for things like checking integrity.
     */
    this.collections = [
      AcademicPlans,
      AcademicYearInstances,
      AdvisorLogs,
      AdvisorProfiles,
      CareerGoals,
      Courses,
      CourseInstances,
      FacultyProfiles,
      Feeds,
      FeedbackInstances,
      HelpMessages,
      DesiredDegrees,
      IceSnapshots,
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
      StudentProfiles,
      Teasers,
      UserInteractions,
      VerificationRequests,
    ];

    /**
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     * Note that some collection class instances are implicitly initialized and so do not appear in this list.
     * This is the list used to specify the collections for both dump and restore.
     * For example: Slugs, AcademicYearInstances, and PublicStats.
     * Some collections are not yet part of dump/restore.
     */
    this.collectionLoadSequence = [
      Semesters,
      HelpMessages,
      InterestTypes,
      Interests,
      CareerGoals,
      DesiredDegrees,
      AcademicPlans,
      MentorProfiles,
      AdvisorProfiles,
      FacultyProfiles,
      StudentProfiles,
      OpportunityTypes,
      Opportunities,
      Courses,
      Teasers,
      CourseInstances,
      OpportunityInstances,
      FeedbackInstances,
      VerificationRequests,
      Feeds,
      AdvisorLogs,
      IceSnapshots,
      UserInteractions,
      MentorQuestions,
      MentorAnswers,
      Reviews,
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
      throw new Meteor.Error(`Called RadGrad.getCollection with unknown collection name: ${collectionName}`,
        '', Error().stack);
    }
    return collection;
  }
}

/**
 * Provides the singleton instance of this class.
 * @type {api/radgrad.RadGradClass}
 * @memberOf api/radgrad
 */
export const RadGrad = new RadGradClass();
