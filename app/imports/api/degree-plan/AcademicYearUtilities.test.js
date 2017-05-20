import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixture } from '../test/test-fixture';
import * as utilities from './AcademicYearUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearUtilities', function testSuite() {
    this.timeout(0);

    before(function setup() {
      removeAllEntities();
      defineTestFixture('FeedbackFunctions.json');
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#getStudentsCurrentSemesterNumber.', function test() {
      const abi = Users.findDoc({ username: 'abi' });
      expect(utilities.getStudentsCurrentSemesterNumber(abi._id)).to.equal(9);
    });
    it('#getStudentSemesters.', function test() {
      const abi = Users.findDoc({ username: 'abi' });
      const semesters = utilities.getStudentSemesters(abi._id);
      expect(semesters.length).to.equal(12);
    });
  });
}
