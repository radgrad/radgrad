/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Semesters } from '/imports/api/semester/SemesterCollection';
import { defineSemesters } from '/imports/api/semester/SemesterUtilities';
import { ROLE } from '/imports/api/role/Role';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { makeSampleOpportunity } from '/imports/api/opportunity/SampleOpportunities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('OpportunityInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #toString, #dumpOne, #restoreOne, findOpportunityInstance', function test() {
      defineSemesters();
      const semester = Semesters.define({ term: Semesters.FALL, year: 2015 });
      const faculty = makeSampleUser(ROLE.FACULTY);
      const student = makeSampleUser();
      const opportunity = makeSampleOpportunity(faculty);
      const verified = true;
      let docID = OpportunityInstances.define({ semester, opportunity, verified, student });
      expect(OpportunityInstances.isOpportunityInstance(semester, opportunity, student)).to.be.true;
      expect(OpportunityInstances.isOpportunityInstance(semester, opportunity, faculty)).to.be.false;
      const dumpObject = OpportunityInstances.dumpOne(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.toString(docID);
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      docID = OpportunityInstances.restoreOne(dumpObject);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.removeIt(docID);
    });
  });
}
