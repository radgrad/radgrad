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
      const docID = FacultyProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
      expect(FacultyProfiles.isDefined(docID)).to.be.true;
      const dumpObject = FacultyProfiles.dumpOne(docID);
      FacultyProfiles.removeIt(docID);
      expect(FacultyProfiles.isDefined(docID)).to.be.false;
      FacultyProfiles.restoreOne(dumpObject);
      const id = FacultyProfiles.getID(username);
      expect(FacultyProfiles.isDefined(id)).to.be.true;
      FacultyProfiles.removeIt(id);
    });
  });
}
