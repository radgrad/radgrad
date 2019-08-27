import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineSemesters, nextSemester, upComingSemesters } from './SemesterUtilities';
import { removeAllEntities } from '../base/BaseUtilities';
import { Semesters } from './SemesterCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SemesterUtilities', function testSuite() {
    before(function setup() {
      removeAllEntities();
      defineSemesters();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#nextSemester', function test() {
      const currentSemester = Semesters.getCurrentSemesterDoc();
      const next = nextSemester(currentSemester);
      expect(next.semesterNumber).to.equal(currentSemester.semesterNumber + 1);
    });

    it('#upComingSemesters', function test() {
      const count = Semesters.find({}).count();
      expect(count).to.be.equal(18);
      const upComing = upComingSemesters();
      // console.log(upComing);
      expect(upComing.length).to.be.equal(8); // TODO This will change over time unless we change defineSemesters.
    });
  });
}
