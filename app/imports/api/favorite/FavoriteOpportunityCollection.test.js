import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FavoriteOpportunities } from './FavoriteOpportunityCollection';
import { makeSampleOpportunity, sampleOpportunityName } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteOpportunityCollection', function testSuite() {
    let opportunity;
    let student;
    let sponsor;

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      sponsor = makeSampleUser(ROLE.FACULTY);
      opportunity = makeSampleOpportunity(sponsor);
      student = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #update, #checkIntegrity', function test() {
      let docID = FavoriteOpportunities.define({ opportunity, student });
      expect(FavoriteOpportunities.isDefined(docID)).to.be.true;
      let problems = FavoriteOpportunities.checkIntegrity();
      expect(problems.length).to.equal(0);
      const dumpObject = FavoriteOpportunities.dumpOne(docID);
      FavoriteOpportunities.removeIt(docID);
      expect(FavoriteOpportunities.isDefined(docID)).to.be.false;
      docID = FavoriteOpportunities.restoreOne(dumpObject);
      problems = FavoriteOpportunities.checkIntegrity();
      expect(problems.length).to.equal(0);
      expect(FavoriteOpportunities.isDefined(docID)).to.be.true;
      expect(FavoriteOpportunities.countNonRetired()).to.equal(1);
      FavoriteOpportunities.update(docID, { retired: true });
      expect(FavoriteOpportunities.countNonRetired()).to.equal(0);
      FavoriteOpportunities.removeIt(docID);
    });

    it('#getOpportunityDoc, #getOpportunitySlug, #getStudentDoc, #getStudentUsername', function test() {
      const docID = FavoriteOpportunities.define({ opportunity, student });
      const opportunityDoc = FavoriteOpportunities.getOpportunityDoc(docID);
      expect(opportunityDoc).to.exist;
      expect(opportunityDoc.name).to.equal(sampleOpportunityName);
      expect(opportunityDoc.sponsorID).to.equal(sponsor);
      const opportunitySlug = Slugs.getNameFromID(opportunityDoc.slugID);
      expect(FavoriteOpportunities.getOpportunitySlug(docID)).to.equal(opportunitySlug);
      const studentDoc = FavoriteOpportunities.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal('Amy');
      const studentUsername = FavoriteOpportunities.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername.endsWith('@hawaii.edu')).to.be.true;
    });
  });
}
