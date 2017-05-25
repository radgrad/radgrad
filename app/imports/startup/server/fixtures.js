import { Meteor } from 'meteor/meteor';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feeds } from '../../api/feed/FeedCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { DesiredDegrees } from '../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../../api/mentor/MentorProfileCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { PlanChoices } from '../../api/degree-plan/PlanChoiceCollection';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { Reviews } from '../../api/review/ReviewCollection';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';
import { RadGrad } from './radgrad';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { getRestoreFileAge, restoreCollection } from '../../api/utility/fixture-utilities';

/* global Assets */

/** @module startup/server/fixtures */

/**
 * Returns an Array of numbers, one per RadGradCollection, indicating the number of documents in that collection.
 * @returns { Array } An array of collection document counts.
 */
function documentCounts() {
  return _.map(RadGrad.collections, collection => collection.count());
}

/**
 * Returns the total number of documents in the RadGrad database.
 * @returns { Number } The total number of RadGrad documents.
 */
function totalDocuments() {
  return _.reduce(documentCounts(), function (sum, count) {
    return sum + count;
  }, 0);
}

/**
 * If the database is empty, this function looks up the name of the restore file in the settings file,
 * then reads it in and calls define() on its contents in order to rebuild the RadGrad database.
 * Console messages are generated when the contents of the restore file does not include collections that
 * this function assumes are present. Conversely, if the restore file contains collections not processed with
 * this file, a string is also printed out.
 */
function newStartupProcess() { // eslint-disable-line
  Meteor.startup(() => {
    if (totalDocuments() === 0) {
      const restoreFileName = Meteor.settings.public.databaseRestoreFileName;
      const restoreFileAge = getRestoreFileAge(restoreFileName);
      console.log(`Restoring database from file ${restoreFileName}, dumped ${restoreFileAge}.`);
      const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
      // The list of collections, ordered so that they can be sequentially restored.
      const collectionList = [Semesters, HelpMessages, InterestTypes, Interests, CareerGoals, DesiredDegrees,
        ValidUserAccounts, Users, OpportunityTypes, Opportunities, Courses, Feedbacks, Teasers,
        CourseInstances, OpportunityInstances, FeedbackInstances,
        VerificationRequests, Feeds, AdvisorLogs, MentorProfiles, MentorQuestions, MentorAnswers, Reviews,
        AcademicPlans, PlanChoices];

      const restoreNames = _.map(restoreJSON.collections, obj => obj.name);
      const collectionNames = _.map(collectionList, collection => collection._collectionName);
      const extraRestoreNames = _.difference(restoreNames, collectionNames);
      const extraCollectionNames = _.difference(collectionNames, restoreNames);

      if (extraRestoreNames.length) {
        console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
      }
      if (extraCollectionNames.length) {
        console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
      }

      if (!extraRestoreNames.length && !extraCollectionNames.length) {
        _.each(collectionList, collection => restoreCollection(collection, restoreJSON, true));
      }
    }
    PublicStats.generateStats();
    SyncedCron.add({
      name: 'Run the PublicStats.generateStats method',
      schedule(parser) {
        return parser.text('every 24 hours');
      },
      job() {
        PublicStats.generateStats();
      },
    });
    SyncedCron.start();
  });
}

newStartupProcess();
