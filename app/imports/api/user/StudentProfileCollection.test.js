import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { StudentProfiles } from './StudentProfileCollection';
import { Semesters } from '../semester/SemesterCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('StudentProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'amytaka@hawaii.edu';
      const firstName = 'Amy';
      const lastName = 'Takayesu';
      const picture = 'amy.jpg';
      const website = 'http://amytaka.github.io';
      const interests = [];
      const careerGoals = [];
      const level = 6;
      const declaredSemester = 'Spring-2017';
      const semesterID = Semesters.define({ year: 2017, term: Semesters.SPRING });
      console.log(semesterID, Semesters.findDoc(semesterID));
      let docID = StudentProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, level, declaredSemester,
      });
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      let dumpObject = StudentProfiles.dumpOne(docID);
      console.log(dumpObject);
      expect(dumpObject.retired).to.be.undefined;
      expect(StudentProfiles.findNonRetired().length).to.equal(1);
      StudentProfiles.update(docID, { retired: true });
      expect(StudentProfiles.findNonRetired().length).to.equal(0);
      StudentProfiles.removeIt(docID);
      expect(StudentProfiles.isDefined(docID)).to.be.false;
      docID = StudentProfiles.restoreOne(dumpObject);
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      StudentProfiles.update(docID, { retired: true });
      dumpObject = StudentProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      StudentProfiles.removeIt(docID);
    });
  });
}
