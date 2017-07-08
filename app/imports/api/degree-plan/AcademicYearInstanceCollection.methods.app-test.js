import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { Users } from '../user/UserCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AcademicYearInstances Meteor Methods  TestBatch1', function test() {
    const collectionName = AcademicYearInstances.getCollectionName();
    const year = 2017;
    const student = 'abi@hawaii.edu';
    const definitionData = {
      student,
      year,
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
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
          const studentID = Users.getID(student);
          const id = AcademicYearInstances.findDoc({ year, studentID })._id;
          const springYear = 2018;
          const semesterIDs = [];
          updateMethod.call({ collectionName, updateData: { id, springYear, semesterIDs } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const studentID = Users.getID(student);
          const instance = AcademicYearInstances.findDoc({ year, studentID })._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
