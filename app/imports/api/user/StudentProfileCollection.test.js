import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { moment } from 'meteor/momentjs:moment';
import { removeAllEntities } from '../base/BaseUtilities';
import { StudentProfiles } from './StudentProfileCollection';

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
      const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
      const username = `student-${uniqueString}@hawaii.edu`;
      const firstName = 'Amy';
      const lastName = 'Takayesu';
      const picture = 'amy.jpg';
      const website = 'http://amytaka.github.io';
      const interests = [];
      const careerGoals = [];
      const level = 6;
      const declaredSemester = 'Spring-2017';
      const shareUsername = false;
      const shareInterests = true;
      let docID = StudentProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, level, declaredSemester, shareUsername, shareInterests,
      });
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      let doc = StudentProfiles.findDoc(docID);
      expect(doc).to.be.an('object');
      expect(doc.shareUsername).to.be.false;
      expect(doc.shareInterests).to.be.true;
      let dumpObject = StudentProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(dumpObject.shareUsername).to.be.false;
      expect(dumpObject.shareInterests).to.be.true;
      expect(StudentProfiles.findNonRetired().length).to.equal(1);
      StudentProfiles.update(docID, { retired: true });
      expect(StudentProfiles.findNonRetired().length).to.equal(0);
      StudentProfiles.removeIt(docID);
      expect(StudentProfiles.isDefined(docID)).to.be.false;
      docID = StudentProfiles.restoreOne(dumpObject);
      doc = StudentProfiles.findDoc(docID);
      expect(doc.shareUsername).to.be.false;
      expect(doc.shareInterests).to.be.true;
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      StudentProfiles.update(docID, { retired: true });
      dumpObject = StudentProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      StudentProfiles.removeIt(docID);
    });
  });
}
