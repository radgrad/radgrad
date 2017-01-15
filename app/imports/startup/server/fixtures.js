/* global Assets */

import { Meteor } from 'meteor/meteor';

import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection.js';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feed } from '../../api/feed/FeedCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { DesiredDegrees } from '../../api/degree/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../../api/mentor/MentorProfileCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { ROLE } from '../../api/role/Role';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';
import { desiredDegreeDefinitions } from '/imports/startup/server/icsdata/DesiredDegreeDefinitions';
import { courseDefinitions } from './icsdata/CourseDefinitions.js';
import { processStarCsvData } from '../../api/star/StarProcessor';
import { interestTypeDefinitions, interestDefinitions } from './icsdata/InterestDefinitions';
import {
  opportunityDefinitions, opportunityTypeDefinitions, opportunityInstances,
}
  from './icsdata/OpportunityDefinitions';
import { careerGoalDefinitions } from './icsdata/CareerGoalDefinitions';
import { userDefinitions } from './icsdata/UserDefinitions';
import {
  recommendationFeedbackDefinitions, warningFeedbackDefinitions, feedbackInstances,
}
  from './icsdata/FeedbackDefinitions.js';
import { defaultAdminAccount } from './icsdata/AdminUser';
import { exampleStudents } from './icsdata/ExampleStudents';
import { helpMessageDefinitions } from './icsdata/HelpMessages';
import { teaserDefinitions } from './icsdata/TeaserDefinitions';
import { feedDefinitions } from './icsdata/FeedDefinitions';
import { mentorspaceQuestionsDefinitions } from './icsdata/MentorSpaceQuestionsDefinitions';
import { mentorspaceAnswersDefinitions } from './icsdata/MentorSpaceAnswersDefinitions';
import { mentorProfilesDefinitions } from './icsdata/MentorProfilesDefinitions';
import { mentorUserDefinitions } from './icsdata/MentorUserDefinitions';
import { radgradCollections } from '../../api/integrity/RadGradCollections';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';


function documentCounts() {
  return _.map(radgradCollections, collection => collection.count());
}
function totalDocuments() {
  return _.reduce(documentCounts(), function (sum, count) {
    return sum + count;
  }, 0);
}

const restoreFileDateFormat = 'YYYY-MM-DD-hh-mm-ss';

function getDefinitions(restoreJSON, collectionName) {
  return _.find(restoreJSON.collections, obj => obj.name === collectionName).contents;
}

function getRestoreFileAge(restoreFileName) {
  const terms = _.words(restoreFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, restoreFileDateFormat).fromNow();
}

function restoreCollection(collection, restoreJSON) {
  const definitions = getDefinitions(restoreJSON, collection._collectionName);
  console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`);
  _.each(definitions, definition => collection.define(definition));
}

function newStartupProcess() { // eslint-disable-line
  Meteor.startup(() => {
    if (totalDocuments() === 0) {
      const restoreFileName = Meteor.settings.public.databaseRestoreFileName;
      const restoreFileAge = getRestoreFileAge(restoreFileName);
      console.log(`Restoring database from file ${restoreFileName}, dumped ${restoreFileAge}.`);
      const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
      // The list of collections, ordered so that they can be sequentially restored.
      const collectionList = [Semesters, HelpMessages, InterestTypes, Interests, Users, ValidUserAccounts,
        DesiredDegrees, CareerGoals, OpportunityTypes, Opportunities, Courses, Feedbacks, Teasers,
        CourseInstances, OpportunityInstances, AcademicYearInstances, FeedbackInstances,
        VerificationRequests, Feed, AdvisorLogs, MentorProfiles, MentorAnswers, MentorQuestions];

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
        _.each(collectionList, collection => restoreCollection(collection, restoreJSON));
      }
    }
  });
}

// if the database is empty on server start, create some sample data.
function oldStartupProcess() { // eslint-disable-line
  Meteor.startup(() => {
    if (Semesters.find().count() === 0) {
      Semesters.define({ term: Semesters.FALL, year: 2014 });
      Semesters.define({ term: Semesters.SPRING, year: 2015 });
      Semesters.define({ term: Semesters.SUMMER, year: 2015 });
      Semesters.define({ term: Semesters.FALL, year: 2015 });
      Semesters.define({ term: Semesters.SPRING, year: 2016 });
      Semesters.define({ term: Semesters.SUMMER, year: 2016 });
      Semesters.define({ term: Semesters.FALL, year: 2016 });
      Semesters.define({ term: Semesters.SPRING, year: 2017 });
      Semesters.define({ term: Semesters.SUMMER, year: 2017 });
      Semesters.define({ term: Semesters.FALL, year: 2017 });
      Semesters.define({ term: Semesters.SPRING, year: 2018 });
      Semesters.define({ term: Semesters.SUMMER, year: 2018 });
      Semesters.define({ term: Semesters.FALL, year: 2018 });
      Semesters.define({ term: Semesters.SPRING, year: 2019 });
      Semesters.define({ term: Semesters.SUMMER, year: 2019 });
      Semesters.define({ term: Semesters.FALL, year: 2019 });
      Semesters.define({ term: Semesters.SPRING, year: 2020 });
      Semesters.define({ term: Semesters.SUMMER, year: 2020 });
    }
    if (HelpMessages.find().count() === 0) {
      console.log('Defining Help Messages');  // eslint-disable-line no-console
      helpMessageDefinitions.map((definition) => HelpMessages.define(definition));
    }
    if (InterestTypes.find().count() === 0) {
      console.log('Defining InterestTypes');  // eslint-disable-line no-console
      interestTypeDefinitions.map((definition) => InterestTypes.define(definition));
    }
    if (Interests.find().count() === 0) {
      console.log('Defining Interests');  // eslint-disable-line no-console
      interestDefinitions.map((definition) => Interests.define(definition));
    }
    if (Users.find().count() === 0) {
      console.log('Defining Users');  // eslint-disable-line no-console
      userDefinitions.forEach((definition) => {
        ValidUserAccounts.define({ username: definition.slug });
        Users.define(definition);
      });
      mentorUserDefinitions.forEach((definition) => {
        ValidUserAccounts.define({ username: definition.slug });
        Users.define(definition);
      });
    }
    if (DesiredDegrees.find().count() === 0) {
      console.log('Defining DesiredDegrees');  // eslint-disable-line no-console
      desiredDegreeDefinitions.map((definition) => DesiredDegrees.define(definition));
    }
    if (CareerGoals.find().count() === 0) {
      console.log('Defining CareerGoals');  // eslint-disable-line no-console
      careerGoalDefinitions.map((definition) => CareerGoals.define(definition));
    }
    if (OpportunityTypes.find().count() === 0) {
      console.log('Defining OpportunityTypes');  // eslint-disable-line no-console
      opportunityTypeDefinitions.map((definition) => OpportunityTypes.define(definition));
    }
    if (Opportunities.find().count() === 0) {
      console.log('Defining Opportunities');  // eslint-disable-line no-console
      opportunityDefinitions.map((definition) => Opportunities.define(definition));
    }
    if (Courses.find().count() === 0) {
      console.log('Defining Courses');  // eslint-disable-line no-console
      courseDefinitions.map((definition) => Courses.define(definition));
    }
    if (Feedbacks.find().count() === 0) {
      console.log('Defining Feedback');  // eslint-disable-line no-console
      recommendationFeedbackDefinitions.map((definition) => Feedbacks.define(definition));
      warningFeedbackDefinitions.map((definition) => Feedbacks.define(definition));
    }
    if (MentorProfiles.find().count() === 0) {
      console.log('Defining MentorProfiles'); // eslint-disable-line no-console
      mentorProfilesDefinitions.map((definition) => MentorProfiles.define(definition));
    }
    if (MentorQuestions.find().count() === 0) {
      console.log('Defining MentorQuestions'); // eslint-disable-line no-console
      mentorspaceQuestionsDefinitions.map((definition) => MentorQuestions.define(definition));
    }
    if (MentorAnswers.find().count() === 0) {
      console.log('Defining MentorAnswers'); // eslint-disable-line no-console
      mentorspaceAnswersDefinitions.map((definition) => MentorAnswers.define(definition));
    }
    if (Teasers.find().count() === 0) {
      console.log('Defining Teasers');  // eslint-disable-line no-console
      teaserDefinitions.map((definition) => Teasers.define(definition));
    }
    if (exampleStudents) {
      exampleStudents.forEach((student) => {
        if (Users.find({ username: student.slug }).count() === 0) {
          console.log(`Defining ${student.slug}`);  // eslint-disable-line no-console
          ValidUserAccounts.define({ username: student.slug });
          /* eslint no-param-reassign: "off" */
          student.role = ROLE.STUDENT;
          const studentID = Users.define(student);
          Users.setUhId(studentID, student.uhID);
          const starDataPath = `testdata/Star${student.firstName}.csv`;
          const studentSlug = Users.findSlugByID(studentID);
          const csvData = Assets.getText(starDataPath);
          const courseInstanceDefinitions = processStarCsvData(studentSlug, csvData);
          const currentSemester = Semesters.findDoc(Semesters.getCurrentSemester());
          courseInstanceDefinitions.map((definition) => {
            const semesterID = Semesters.getID(definition.semester);
            const ciSemester = Semesters.findDoc(semesterID);
            if (currentSemester.sortBy <= ciSemester.sortBy) {
              definition.verified = false;
            }
            CourseInstances.define(definition);
            const split = definition.semester.split('-');
            let yearVal = parseInt(split[1], 10);
            if (split[0] !== 'Fall') {
              yearVal -= 1;
            }
            return AcademicYearInstances.define({ student: studentSlug, year: yearVal });
          });
        }
      });
    }
    if (FeedbackInstances.find().count() === 0) {
      console.log('Defining FeedbackInstances');  // eslint-disable-line no-console
      feedbackInstances.map((definition) => FeedbackInstances.define(definition));
    }
    if (OpportunityInstances.find().count() === 0) {
      const opportunityInstanceIDs = [];
      console.log('Defining OpportunityInstances');  // eslint-disable-line no-console
      opportunityInstances.map((definition) => opportunityInstanceIDs.push(OpportunityInstances.define(definition)));
      const currentSemester = Semesters.getCurrentSemesterDoc();
      opportunityInstanceIDs.forEach((id) => {
        const oppInstance = OpportunityInstances.findDoc(id);
        if (currentSemester.sortBy > OpportunityInstances.getSemesterDoc(oppInstance._id).sortBy) {
          const student = OpportunityInstances.getStudentDoc(oppInstance._id);
          console.log(`Defining VerificationRequest for ${student.username}`);  // eslint-disable-line no-console
          VerificationRequests.define({ student: student.username, opportunityInstance: oppInstance._id });
        }
        return false;
      });
    }
    if (Feed.find().count() === 0) {
      console.log('Defining Feed');  // eslint-disable-line no-console
      feedDefinitions.map((definition) => Feed.define(definition));
    }
    if (defaultAdminAccount) {
      const admin = defaultAdminAccount;
      if (Users.find({ username: admin.slug }).count() === 0) {
        ValidUserAccounts.define({ username: admin.slug });
        console.log('Defining admin');  // eslint-disable-line no-console
        admin.role = ROLE.ADMIN;
        Users.define(admin);
      }
    }
  });
}

oldStartupProcess();
