import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { Users } from '../user/UserCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #toString', function test() {
      const student = Users.findSlugByID(makeSampleUser());
      const year = 2016;
      let docID = AcademicYearInstances.define({ year, student });
      expect(AcademicYearInstances.isDefined(docID)).to.be.true;
      const dumpObject = AcademicYearInstances.dumpOne(docID);
      AcademicYearInstances.removeIt(docID);
      expect(AcademicYearInstances.isDefined(docID)).to.be.false;
      docID = AcademicYearInstances.restoreOne(dumpObject);
      expect(AcademicYearInstances.isDefined(docID)).to.be.true;
      expect(AcademicYearInstances.toString(docID)).to.equal(`[AY 2016-2017 ${student}]`);
      AcademicYearInstances.removeIt(docID);
    });
  });
}

