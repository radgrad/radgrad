import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorProfiles } from './MentorProfileCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'rbrewer@tableau.com';
      const firstName = 'Robert';
      const lastName = 'Brewer';
      const picture = 'foo.jpg';
      const website = 'http://rbrewer.github.io';
      const interests = [];
      const careerGoals = [];
      const company = 'Tableau Inc';
      const career = 'Software Engineer';
      const location = 'San Francisco, CA';
      const linkedin = 'robertsbrewer';
      const motivation = 'Help future students.';
      let docID = MentorProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, company, career, location, linkedin, motivation,
      });
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      let dumpObject = MentorProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(MentorProfiles.findNonRetired().length).to.equal(1);
      MentorProfiles.update(docID, { retired: true });
      expect(MentorProfiles.findNonRetired().length).to.equal(0);
      MentorProfiles.removeIt(docID);
      expect(MentorProfiles.isDefined(docID)).to.be.false;
      MentorProfiles.restoreOne(dumpObject);
      docID = MentorProfiles.getID(username);
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      MentorProfiles.update(docID, { retired: true });
      dumpObject = MentorProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      MentorProfiles.removeIt(docID);
    });
  });
}
