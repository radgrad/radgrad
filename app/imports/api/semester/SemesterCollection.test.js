/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('SemesterCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#get, #isDefined, #removeIt', function test() {
      const semester = Semesters.define({ term: Semesters.FALL, year: 2010 });
      expect(Semesters.isDefined(semester)).to.be.true;
      Semesters.removeIt(semester);
      expect(Semesters.isDefined(semester)).to.be.false;
    });

    it('#get (multiple definition)', function test() {
      const semester = Semesters.define({ term: Semesters.FALL, year: 2012 });
      const semester2 = Semesters.define({ term: Semesters.FALL, year: 2012 });
      expect(semester).to.equal(semester2);
      Semesters.removeIt(semester);
      expect(Semesters.isDefined(semester2)).to.be.false;
    });

    it('#assertSemester', function test() {
      const semester = Semesters.define({ term: Semesters.SUMMER, year: 2015 });
      expect(function foo() { Semesters.assertSemester(semester);}).to.not.throw(Error);
      Semesters.removeIt(semester);
      expect(function foo() { Semesters.assertSemester(semester);}).to.throw(Error);
    });

    it('#toString', function test() {
      const semester = Semesters.define({ term: Semesters.SPRING, year: 2010 });
      expect(Semesters.toString(semester)).to.equal('Spring 2010');
      Semesters.removeIt(semester);
    });
  });
}

