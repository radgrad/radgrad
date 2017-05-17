/* global Assets */

import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

/** @module api/test/test-fixture */

// Must match the format in the client-side ui/pages/admin/admin-database-dump-page.js
const restoreFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the restore file was created. Parses the file name string.
 * @param restoreFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 */
function getRestoreFileAge(restoreFileName) {
  const terms = _.words(restoreFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, restoreFileDateFormat).fromNow();
}

/**
 * Returns the definition array associated with collectionName in the restoreJSON structure.
 * @param restoreJSON The restore file contents.
 * @param collection The collection of interest.
 */
function getDefinitions(restoreJSON, collection) {
  return _.find(restoreJSON.collections, obj => obj.name === collection).contents;
}

/**
 * Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be restored.
 * @param restoreJSON The structure containing all of the definitions.
 */
function restoreCollection(collection, restoreJSON) {
  const definitions = getDefinitions(restoreJSON, collection._collectionName);
  console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`); // eslint-disable-line
  _.each(definitions, definition => collection.define(definition));
}

export function defineTestFixture() {
  const restoreFileName = 'database/mockup/2017-03-10-10-04-41.json';
  const restoreFileAge = getRestoreFileAge(restoreFileName);
  console.log(`Restoring test fixture from file ${restoreFileName}, dumped ${restoreFileAge}.`); // eslint-disable-line
  const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
  // The list of collections, ordered so that they can be sequentially restored.
  const collectionList = [Semesters, InterestTypes, Interests, CareerGoals, DesiredDegrees,
    ValidUserAccounts, Users, OpportunityTypes, Opportunities, Courses, Feedbacks, Teasers,
    CourseInstances, OpportunityInstances, FeedbackInstances,
    VerificationRequests, AcademicPlans];

  // const restoreNames = _.map(restoreJSON.collections, obj => obj.name);
  // const collectionNames = _.map(collectionList, collection => collection._collectionName);
  // const extraRestoreNames = _.difference(restoreNames, collectionNames);
  // const extraCollectionNames = _.difference(collectionNames, restoreNames);

  // if (extraRestoreNames.length) {
  //   console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
  // }
  // if (extraCollectionNames.length) {
  //   console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
  // }

  // if (!extraRestoreNames.length && !extraCollectionNames.length) {
  _.each(collectionList, collection => restoreCollection(collection, restoreJSON));
  // }
}
