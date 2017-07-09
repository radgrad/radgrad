import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CourseInstances } from './CourseInstanceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseInstanceCollection Meteor Methods TestBatch1 foo', function test() {
    const collectionName = CourseInstances.getCollectionName();
    const semester = 'Spring-2017';
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

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        const id = CourseInstances.findCourseInstanceDoc(semester, course, student)._id;
        const verified = false;
        const grade = 'A';
        const creditHrs = 4;
        await updateMethod.callPromise({ collectionName, updateData: { id, verified, grade, creditHrs } });
      } catch (e) {
        console.log('update error', e);
      }
    });

    it('Remove Method', async function () {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        const instance = CourseInstances.findCourseInstanceDoc(semester, course, student)._id;
        await removeItMethod.callPromise({ collectionName, instance });
      } catch (e) {
        console.log('remove error', e);
      }
    });
  });
}
