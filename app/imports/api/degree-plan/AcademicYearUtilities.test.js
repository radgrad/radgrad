import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixtures } from '../test/test-utilities';
import * as utilities from './AcademicYearUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearUtilities', function testSuite() {
    before(function setup() {
      this.timeout(0);
      defineTestFixtures(['minimal', 'abi.student', 'extended.courses.interests', 'abi.courseinstances']);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#getStudentsCurrentSemesterNumber.', function test() {
      const abi = Users.getProfile('abi');
      expect(utilities.getStudentsCurrentSemesterNumber(abi._id)).to.equal(9);
    });
    it('#getStudentSemesters.', function test() {
      const abi = Users.getProfile('abi');
      const semesters = utilities.getStudentSemesters(abi._id);
      expect(semesters.length).to.equal(12);
    });
  });
}
