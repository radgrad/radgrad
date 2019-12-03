import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { FacultyProfiles } from './FacultyProfileCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FacultyProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'esb@hawaii.edu';
      const firstName = 'Edo';
      const lastName = 'Biagioni';
      const picture = 'esb.jpg';
      const website = 'http://esb.github.io';
      const interests = [];
      const careerGoals = [];
      let docID = FacultyProfiles.define({
        username, firstName, lastName, picture, website, interests, careerGoals,
      });
      expect(FacultyProfiles.isDefined(docID)).to.be.true;
      let dumpObject = FacultyProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(FacultyProfiles.findNonRetired().length).to.equal(1);
      FacultyProfiles.update(docID, { retired: true });
      expect(FacultyProfiles.findNonRetired().length).to.equal(0);
      FacultyProfiles.removeIt(docID);
      expect(FacultyProfiles.isDefined(docID)).to.be.false;
      FacultyProfiles.restoreOne(dumpObject);
      docID = FacultyProfiles.getID(username);
      expect(FacultyProfiles.isDefined(docID)).to.be.true;
      FacultyProfiles.update(docID, { retired: true });
      dumpObject = FacultyProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      FacultyProfiles.removeIt(docID);
    });
  });
}
