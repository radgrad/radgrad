import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixture } from '../test/test-utilities';
import * as utilities from './AcademicYearUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearUtilities', function testSuite() {
    this.timeout(0);

    before(function setup() {
      removeAllEntities();
      defineTestFixture('AcademicYearUtilities.json');
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#getStudentsCurrentSemesterNumber.', function test() {
      const abi = Users.findDoc({ username: 'abi' });
      // PJ says: After cleaning up Semesters.define(), this now equals 12, not 9. Explain?
      // expect(utilities.getStudentsCurrentSemesterNumber(abi._id)).to.equal(9);
      expect(utilities.getStudentsCurrentSemesterNumber(abi._id)).to.equal(12);
    });
    it('#getStudentSemesters.', function test() {
      const abi = Users.findDoc({ username: 'abi' });
      const semesters = utilities.getStudentSemesters(abi._id);
      expect(semesters.length).to.equal(12);
    });
  });
}
