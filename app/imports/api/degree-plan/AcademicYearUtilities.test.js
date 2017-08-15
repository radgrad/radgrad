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
      this.timeout(5000);
      defineTestFixtures(['minimal', 'abi.student', 'extended.courses.interests', 'abi.courseinstances']);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#getStudentsCurrentSemesterNumber.', function test() {
      const profile = Users.getProfile('abi@hawaii.edu');
      expect(utilities.getStudentsCurrentSemesterNumber(profile.userID)).to.equal(10);
    });
    it('#getStudentSemesters.', function test() {
      const profile = Users.getProfile('abi@hawaii.edu');
      const semesters = utilities.getStudentSemesters(profile.userID);
      expect(semesters.length).to.equal(12);
    });
  });
}
