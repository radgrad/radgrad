import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { getFutureEnrollmentMethod } from './CourseCollection.methods';
import { Courses } from './CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import { nextSemester } from '../semester/SemesterUtilities';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseCollection Meteor Methods ', function test() {
    const collectionName = Courses.getCollectionName();
    const definitionData = {
      name: 'Introduction to the theory and practice of scripting',
      shortName: 'Intro to Scripting',
      slug: 'ics_215',
      number: 'ICS 215',
      description: 'Introduction to scripting languages.',
      creditHrs: 4,
      interests: ['java'],
      syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
      prerequisites: ['ics_111'],
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Courses.findIdBySlug(definitionData.slug);
      const name = 'updated CareerGoal name';
      const description = 'updated CareerGoal description';
      const interests = ['algorithms', 'java'];
      const prerequisites = ['ics_111', 'ics_141'];
      await updateMethod.callPromise({
        collectionName,
        updateData: { id, name, description, interests, prerequisites },
      });
    });

    it('getFutureEnrollment Methods', async function () {
      const id = Courses.findIdBySlug(definitionData.slug);
      const enrollmentData = await getFutureEnrollmentMethod.callPromise(id);
      expect(enrollmentData[0][1]).to.equal(0);

      // Now make a course instance for next semester
      const semester = Semesters.getSlug(nextSemester(Semesters.getCurrentSemesterDoc())._id);
      const student = 'abi@hawaii.edu';
      const course = 'ics_111';
      const definitionData = {
        semester,
        course,
        student,
        verified: true,
        fromSTAR: true,
        grade: 'B',
        note: '',
        creditHrs: 3,
      };
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
    });
  });
}
