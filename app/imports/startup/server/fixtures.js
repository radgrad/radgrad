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
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';

import { courseDefinitions } from './icsdata/CourseDefinitions.js';
import { processStarCsvData } from '/imports/api/star/StarProcessor';
import { interestTypeDefinitions, interestDefinitions } from '/imports/startup/server/icsdata/InterestDefinitions';
import {
    opportunityDefinitions, opportunityTypeDefinitions
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
  }
  if (InterestTypes.find().count() === 0) {
    console.log('Defining InterestTypes');
    interestTypeDefinitions.map((definition) => InterestTypes.define(definition));
  }
  if (Interests.find().count() === 0) {
    console.log('Defining Interests');
    interestDefinitions.map((definition) => Interests.define(definition));
  }
  if (Users.find().count() === 1) {
    console.log('Defining Users');
    userDefinitions.map((definition) => Users.define(definition));
  }
  if (CareerGoals.find().count() === 0) {
    console.log('Defining CareerGoals');
    careerGoalDefinitions.map((definition) => CareerGoals.define(definition));
  }
  if (OpportunityTypes.find().count() === 0) {
    console.log('Defining OpportunityTypes');
    opportunityTypeDefinitions.map((definition) => OpportunityTypes.define(definition));
  }
  if (Opportunities.find().count() === 0) {
    console.log('Defining Opportunities');
    opportunityDefinitions.map((definition) => Opportunities.define(definition));
  }
  if (Courses.find().count() === 0) {
    console.log('Defining Courses');
    courseDefinitions.map((definition) => Courses.define(definition));
  }
  if (Feedbacks.find().count() === 0) {
    console.log('Defining Feedback');
    recommendationFeedbackDefinitions.map((definition) => Feedbacks.define(definition));
    warningFeedbackDefinitions.map((definition) => Feedbacks.define(definition));
  }
  if (!!Meteor.settings.exampleStudents) {
    Meteor.settings.exampleStudents.forEach((student) => {
      if (Users.find({ username: student.slug }).count() === 0) {
        console.log(`defining ${student.slug}`);
        /* eslint no-param-reassign: "off" */
        student.role = ROLE.STUDENT;
        const studentID = Users.define(student);
        const starDataPath = `testdata/Star${student.firstName}.csv`;
        const studentSlug = Users.findSlugByID(studentID);
        const csvData = Assets.getText(starDataPath);
        const courseInstanceDefinitions = processStarCsvData(studentSlug, csvData);
        const currentSemester = Semesters.findDoc(Semesters.getCurrentSemester());
        console.log(currentSemester);
        courseInstanceDefinitions.map((definition) => {
          const semesterID = Semesters.getID(definition.semester);
          const ciSemester = Semesters.findDoc(semesterID);
          console.log(currentSemester.sortBy);
          console.log(ciSemester.sortBy);
          if (currentSemester.sortBy <= ciSemester.sortBy) {
            definition.verified = false;
          }
          CourseInstances.define(definition);
          const split = definition.semester.split('-');
          let yearVal = parseInt(split[1], 10)
          if (split[0] !== 'Fall') {
            yearVal -= 1;
          }
          return AcademicYearInstances.define({ student: studentSlug, year: yearVal });
        });
      }
    });
  }
  if (FeedbackInstances.find().count() === 0) {
    console.log('Defining FeedbackInstances');
    feedbackInstances.map((definition) => FeedbackInstances.define(definition));
  }
  if (!!Meteor.settings.defaultAdminAccount) {
    const admin = Meteor.settings.defaultAdminAccount;
    if (Users.find({ username: admin.slug }).count() === 0) {
      console.log(`defining ${admin.slug}`);
      admin.role = ROLE.ADMIN;
      Users.define(admin);
    }
  }
});
