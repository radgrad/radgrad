import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { defineSemesters } from '../semester/SemesterUtilities';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleOpportunityType } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('OpportunityCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      defineSemesters();
      const name = 'ATT Hackathon';
      const slug = 'att-hackathon-2016';
      const ice = { i: 10, c: 0, e: 10 };
      const description = 'Programming challenge at Sacred Hearts Academy, March 1, 2016.';
      const opportunityType = makeSampleOpportunityType();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const interests = [makeSampleInterest()];
      const semesters = ['Fall-2015'];
      let docID = Opportunities.define({
        name, slug, description, opportunityType, sponsor, interests, semesters, ice,
      });
      expect(Opportunities.isDefined(docID)).to.be.true;
      const dumpObject = Opportunities.dumpOne(docID);
      Opportunities.removeIt(docID);
      expect(Opportunities.isDefined(slug)).to.be.false;
      docID = Opportunities.restoreOne(dumpObject);
      expect(Opportunities.isDefined(docID)).to.be.true;
      Opportunities.removeIt(docID);
    });
  });
}

