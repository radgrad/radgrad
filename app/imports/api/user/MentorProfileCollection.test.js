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
      const docID = MentorProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, company, career, location, linkedin, motivation,
      });
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      const dumpObject = MentorProfiles.dumpOne(docID);
      MentorProfiles.removeIt(docID);
      expect(MentorProfiles.isDefined(docID)).to.be.false;
      MentorProfiles.restoreOne(dumpObject);
      const id = MentorProfiles.getID(username);
      expect(MentorProfiles.isDefined(id)).to.be.true;
      MentorProfiles.removeIt(id);
    });
  });
}
