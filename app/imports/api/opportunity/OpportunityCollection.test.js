/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { ROLE } from '/imports/api/role/Role';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { makeSampleOpportunityType } from '/imports/api/opportunity/SampleOpportunities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('OpportunityCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const name = 'ATT Hackathon';
      const slug = 'att-hackathon-2016';
      const ice = { i: 10, c: 0, e: 10 };
      const description = 'Programming challenge at Sacred Hearts Academy, March 1, 2016.';
      const opportunityType = makeSampleOpportunityType();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const interests = [makeSampleInterest()];
      const semesters = ['Fall-2015'];
      const docID = Opportunities.define({
        name, slug, description, opportunityType, sponsor, interests, semesters, ice,
      });
      expect(Opportunities.isDefined(docID)).to.be.true;
      Opportunities.removeIt(docID);
      expect(Opportunities.isDefined(docID)).to.be.false;
    });
  });
}

