import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Semesters } from '../semester/SemesterCollection';
import { defineSemesters } from '../semester/SemesterUtilities';
import { ROLE } from '../role/Role';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

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
