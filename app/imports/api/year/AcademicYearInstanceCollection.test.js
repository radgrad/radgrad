import { Users } from '/imports/api/user/UserCollection';
import { AcademicYearInstances } from '/imports/api/year/AcademicYearInstanceCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const student = Users.findSlugByID(makeSampleUser());
      const year = 2016;
      let docID = AcademicYearInstances.define({ year, student });
      expect(AcademicYearInstances.isDefined(docID)).to.be.true;
      const dumpObject = AcademicYearInstances.dumpOne(docID);
      AcademicYearInstances.removeIt(docID);
      expect(AcademicYearInstances.isDefined(docID)).to.be.false;
      docID = AcademicYearInstances.restoreOne(dumpObject);
      expect(AcademicYearInstances.isDefined(docID)).to.be.true;
      AcademicYearInstances.removeIt(docID);
    });
  });
}

