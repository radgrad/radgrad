import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { AdvisorProfiles } from './AdvisorProfileCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AdvisorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'glau@hawaii.edu';
      const firstName = 'Gerald';
      const lastName = 'Lau';
      const picture = 'glau.jpg';
      const website = 'http://glau.github.io';
      const interests = [];
      const careerGoals = [];
      let docID = AdvisorProfiles.define({
        username, firstName, lastName, picture, website, interests, careerGoals,
      });
      expect(AdvisorProfiles.isDefined(docID)).to.be.true;
      let dumpObject = AdvisorProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(AdvisorProfiles.findNonRetired().length).to.equal(1);
      AdvisorProfiles.update(docID, { retired: true });
      expect(AdvisorProfiles.findNonRetired().length).to.equal(0);
      AdvisorProfiles.removeIt(docID);
      expect(AdvisorProfiles.isDefined(docID)).to.be.false;
      AdvisorProfiles.restoreOne(dumpObject);
      docID = AdvisorProfiles.getID(username);
      expect(AdvisorProfiles.isDefined(docID)).to.be.true;
      AdvisorProfiles.update(docID, { retired: true });
      dumpObject = AdvisorProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      AdvisorProfiles.removeIt(docID);
    });
  });
}
