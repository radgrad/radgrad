/* global Assets */

import { Meteor } from 'meteor/meteor';

import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
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
  if (!!Meteor.settings.exampleStudents) {
    Meteor.settings.exampleStudents.forEach((student) => {
      if (Users.find({ username: student.slug }).count() === 0) {
        console.log(`defining ${student.slug}`);
        student.role = ROLE.STUDENT;
        const studentID = Users.define(student);
        const starDataPath = `testdata/Star${student.firstName}.csv`;
        const studentSlug = Users.findSlugByID(studentID);
        const csvData = Assets.getText(starDataPath);
        const courseInstanceDefinitions = processStarCsvData(studentSlug, csvData);
        console.log(courseInstanceDefinitions);
        courseInstanceDefinitions.map((definition) => CourseInstances.define(definition));
      }
    });
  }
});
