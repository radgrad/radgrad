import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Semesters } from '../semester/SemesterCollection';
import { defineSemesters } from '../semester/SemesterUtilities';
import { ROLE } from '../role/Role';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

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
      let dumpObject = OpportunityInstances.dumpOne(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      expect(dumpObject.retired).to.be.undefined;
      expect(OpportunityInstances.findNonRetired().length).to.equal(1);
      OpportunityInstances.update(docID, { retired: true });
      expect(OpportunityInstances.findNonRetired().length).to.equal(0);
      OpportunityInstances.toString(docID);
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      docID = OpportunityInstances.restoreOne(dumpObject);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.update(docID, { retired: true });
      dumpObject = OpportunityInstances.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      OpportunityInstances.removeIt(docID);
    });
    it('dangling VR', function test() {
      const semester = Semesters.define({ term: Semesters.SPRING, year: 2019 });
      const faculty = makeSampleUser(ROLE.FACULTY);
      const student = makeSampleUser();
      const opportunity = makeSampleOpportunity(faculty);
      const verified = false;
      const docID = OpportunityInstances.define({ semester, opportunity, verified, student });
      const vrID = VerificationRequests.define({ student, opportunityInstance: docID });
      expect(OpportunityInstances.isOpportunityInstance(semester, opportunity, student)).to.be.true;
      expect(VerificationRequests.isDefined(vrID)).to.be.true;
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      expect(VerificationRequests.isDefined(vrID)).to.be.false;
    });
  });
}
