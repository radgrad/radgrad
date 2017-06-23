import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CourseInstances } from './CourseInstanceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseInstanceCollection Meteor Methods', function test() {
    const collectionName = CourseInstances.getCollectionName();
    const semester = 'Spring-2017';
    const student = 'abi';
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
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = CourseInstances.findCourseInstanceDoc(semester, course, student)._id;
          const verified = false;
          const grade = 'A';
          const creditHrs = 4;
          updateMethod.call({ collectionName, updateData: { id, verified, grade, creditHrs } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = CourseInstances.findCourseInstanceDoc(semester, course, student)._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
