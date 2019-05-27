import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Semesters } from './SemesterCollection';
import { removeAllEntities } from '../base/BaseUtilities';

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

    it('#get, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Semesters.define({ term: Semesters.FALL, year: 2010 });
      expect(Semesters.isDefined(docID)).to.be.true;
      let dumpObject = Semesters.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(Semesters.findNonRetired().length).to.equal(1);
      Semesters.update(docID, { retired: true });
      expect(Semesters.findNonRetired().length).to.equal(0);
      Semesters.removeIt(docID);
      expect(Semesters.isDefined(docID)).to.be.false;
      docID = Semesters.restoreOne(dumpObject);
      expect(Semesters.isDefined(docID)).to.be.true;
      Semesters.update(docID, { retired: true });
      dumpObject = Semesters.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      Semesters.removeIt(docID);
    });

    it('#get (multiple definition)', function test() {
      const semesterID = Semesters.define({ term: Semesters.FALL, year: 2012 });
      const semesterID2 = Semesters.define({ term: Semesters.FALL, year: 2012 });
      expect(semesterID).to.equal(semesterID2);
      Semesters.removeIt(semesterID);
      expect(Semesters.isDefined(semesterID2)).to.be.false;
    });

    it('#assertSemester', function test() {
      const semesterID = Semesters.define({ term: Semesters.SUMMER, year: 2015 });
      expect(function foo() { Semesters.assertSemester(semesterID); }).to.not.throw(Error);
      Semesters.removeIt(semesterID);
      expect(function foo() { Semesters.assertSemester(semesterID); }).to.throw(Error);
    });

    it('#toString', function test() {
      const semesterID = Semesters.define({ term: Semesters.SPRING, year: 2010 });
      expect(Semesters.toString(semesterID)).to.equal('Spring 2010');
      Semesters.removeIt(semesterID);
    });

    it('#semesterNumber', function test() {
      let semesterID = Semesters.define({ term: Semesters.SPRING, year: 2011 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(1);

      semesterID = Semesters.define({ term: Semesters.SUMMER, year: 2011 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(2);

      semesterID = Semesters.define({ term: Semesters.FALL, year: 2011 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(3);

      semesterID = Semesters.define({ term: Semesters.SPRING, year: 2012 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(4);

      semesterID = Semesters.define({ term: Semesters.SUMMER, year: 2012 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(5);

      semesterID = Semesters.define({ term: Semesters.FALL, year: 2012 });
      expect(Semesters.findDoc(semesterID).semesterNumber).to.equal(6);
    });

    it('#getID', function test() {
      expect(Semesters.getID('Summer-2010')).to.be.a('string');
      expect(Semesters.getID('Summer-2040')).to.be.a('string');
      expect(function foo() { Semesters.getID('foobar'); }).to.throw(Error);
    });

    it('#getShortName', function test() {
      const semesterID = Semesters.getID('Summer-2010');
      expect(Semesters.getShortName(semesterID)).to.equal('Sum 10');
    });
  });
}

