import { Meteor } from 'meteor/meteor';
import { ROLE } from '/imports/api/role/Role';
import { expect } from 'chai';
import { VerificationRequests } from './VerificationRequestCollection.js';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { makeSampleOpportunityInstance } from '/imports/api/opportunity/SampleOpportunities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('VerificationRequestCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #toString, #dumpOne, #restoreOne', function test() {
      Semesters.define({ term: Semesters.SUMMER, year: 2015 });
      Semesters.define({ term: Semesters.FALL, year: 2015 });
      const student = makeSampleUser();
      const faculty = makeSampleUser(ROLE.FACULTY);
      const opportunityInstance = makeSampleOpportunityInstance(student, faculty);
      let docID = VerificationRequests.define({ student, opportunityInstance });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      VerificationRequests.toString(docID);
      const dumpObject = VerificationRequests.dumpOne(docID);
      VerificationRequests.removeIt(docID);
      expect(VerificationRequests.isDefined(docID)).to.be.false;
      docID = VerificationRequests.restoreOne(dumpObject);
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      VerificationRequests.removeIt(docID);
    });
  });
}
