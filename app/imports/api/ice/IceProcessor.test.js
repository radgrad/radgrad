/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { isICE, assertICE, makeCourseICE } from '/imports/api/ice/IceProcessor';
import { expect } from 'chai';

if (Meteor.isServer) {
  describe('IceProcessor', function testSuite() {
    it('#isICE, #assertICE', function test() {
      const ice = { i: 0, c: 10, e: 15 };
      const notIce = { i: 0, d: 10, e: 15 };
      const notIce2 = 'foo';
      assertICE(ice);
      expect(isICE(ice)).to.be.true;
      expect(isICE(notIce)).to.be.false;
      expect(isICE(notIce2)).to.be.false;
      expect(isICE(undefined)).to.be.false;
      expect(function foo() { assertICE(ice); }).to.not.throw(Error);
      expect(function foo() { assertICE(notIce); }).to.throw(Error);
    });
    it('#makeCourseICE', function test() {
      expect(makeCourseICE('ICS111', 'A').c).to.equal(9);
      expect(makeCourseICE('ICS111', 'B').c).to.equal(5);
      expect(makeCourseICE('other', 'A').c).to.equal(0);
    });
  });
}
