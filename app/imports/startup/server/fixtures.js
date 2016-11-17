/* global Assets */

import { Meteor } from 'meteor/meteor';

import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
// import { FeedbackType } from '../../api/feedback/FeedbackType.js';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';

import { courseDefinitions } from './icsdata/CourseDefinitions.js';
import { processStarCsvData } from '/imports/api/star/StarProcessor';
import { interestTypeDefinitions, interestDefinitions } from '/imports/startup/server/icsdata/InterestDefinitions';
import {
    opportunityDefinitions, opportunityTypeDefinitions, opportunityInstances,
}
    from '/imports/startup/server/icsdata/OpportunityDefinitions';
import { careerGoalDefinitions } from '/imports/startup/server/icsdata/CareerGoalDefinitions';
import { userDefinitions } from '/imports/startup/server/icsdata/UserDefinitions';
import { recommendationFeedbackDefinitions, warningFeedbackDefinitions,
    feedbackInstances }
    from '/imports/startup/server/icsdata/FeedbackDefinitions.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Semesters.find().count() === 0) {
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
  if (InterestTypes.find().count() === 0) {
    console.log('Defining InterestTypes');  // eslint-disable-line no-console
    interestTypeDefinitions.map((definition) => InterestTypes.define(definition));
  }
  if (Interests.find().count() === 0) {
    console.log('Defining Interests');  // eslint-disable-line no-console
    interestDefinitions.map((definition) => Interests.define(definition));
  }
  if (Users.find().count() === 1) {
    console.log('Defining Users');  // eslint-disable-line no-console
    userDefinitions.map((definition) => Users.define(definition));
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
  if (Meteor.settings.exampleStudents) {
    Meteor.settings.exampleStudents.forEach((student) => {
      if (Users.find({ username: student.slug }).count() === 0) {
        console.log(`defining ${student.slug}`);  // eslint-disable-line no-console
        /* eslint no-param-reassign: "off" */
        student.role = ROLE.STUDENT;
        const studentID = Users.define(student);
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
  if (Meteor.settings.defaultAdminAccount) {
    const admin = Meteor.settings.defaultAdminAccount;
    if (Users.find({ username: admin.slug }).count() === 0) {
      console.log('Defining admin');  // eslint-disable-line no-console
      admin.role = ROLE.ADMIN;
      Users.define(admin);
    }
  }
});
