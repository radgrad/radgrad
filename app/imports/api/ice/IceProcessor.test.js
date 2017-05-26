import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Courses } from '../../api/course/CourseCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import * as ICE from './IceProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixture } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('IceProcessor', function testSuite() {
    this.timeout(0);
    it('#isICE, #assertICE', function test() {
      const ice = { i: 0, c: 10, e: 15 };
      const notIce = { i: 0, d: 10, e: 15 };
      const notIce2 = 'foo';
      ICE.assertICE(ice);
      expect(ICE.isICE(ice)).to.be.true;
      expect(ICE.isICE(notIce)).to.be.false;
      expect(ICE.isICE(notIce2)).to.be.false;
      expect(ICE.isICE(undefined)).to.be.false;
      expect(function foo() { ICE.assertICE(ice); }).to.not.throw(Error);
      expect(function foo() { ICE.assertICE(notIce); }).to.throw(Error);
    });
    it('#makeCourseICE', function test() {
      expect(ICE.makeCourseICE('ICS111', 'A').c).to.equal(ICE.gradeCompetency.A);
      expect(ICE.makeCourseICE('ICS111', 'B').c).to.equal(ICE.gradeCompetency.B);
      expect(ICE.makeCourseICE(Courses.unInterestingSlug, 'A').c).to.equal(ICE.gradeCompetency.C);
    });
    it('#getEarnedICE, #getProjectedICE', function test() {
      defineTestFixture('AcademicYearUtilities.json');
      const cis = CourseInstances.find().fetch();
      const earnedICE = ICE.getEarnedICE(cis);
      expect(ICE.isICE(earnedICE)).to.be.true;
      expect(earnedICE.i).to.be.equal(0);
      expect(earnedICE.c).to.be.equal(80);
      expect(earnedICE.e).to.be.equal(0);
      const projectedICE = ICE.getProjectedICE(cis);
      expect(ICE.isICE(projectedICE)).to.be.true;
      expect(projectedICE.i).to.be.equal(0);
      expect(projectedICE.c).to.be.equal(116);
      expect(projectedICE.e).to.be.equal(0);
      removeAllEntities();
    });
  });
}
