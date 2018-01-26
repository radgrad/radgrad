import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { upComingSemesters } from './SemesterUtilities';
import { removeAllEntities } from '../base/BaseUtilities';
import { Semesters } from './SemesterCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SemesterCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#upComingSemesters', function test() {
      // const currentSemester = Semesters.getCurrentSemester();
      const count = Semesters.find().count();
      expect(count).to.be.above(0);
      const upComing = upComingSemesters();
      expect(upComing.length).to.be.above(0);
    });
  });
}
