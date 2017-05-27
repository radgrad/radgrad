import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
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
      const errors = AcademicYearInstances.checkIntegrity();
      expect(errors.length).to.equal(0);
      AcademicYearInstances.removeIt(docID);
    });
    it('#publish', function test(done) {
      const studentID = makeSampleUser();
      const collector = new PublicationCollector({ userID: studentID });
      const student = Users.findSlugByID(studentID);
      const year = 2016;
      AcademicYearInstances.define({ year, student });
      AcademicYearInstances.publish();
      collector.collect(AcademicYearInstances.publicationNames.Public, (collections) => {
        expect(collections).to.be.an('object');
        expect(collections[AcademicYearInstances.publicationNames.Public]).to.be.an('array');
        expect(collections[AcademicYearInstances.publicationNames.Public].length).to.equal(0);
      });
      collector.collect(AcademicYearInstances.publicationNames.PerStudentID, studentID, (collections) => {
        expect(collections).to.be.an('object');
        expect(collections[AcademicYearInstances.publicationNames.Public]).to.be.an('array');
        expect(collections[AcademicYearInstances.publicationNames.Public].length).to.equal(1);
      });
      done();
    });
  });
}

