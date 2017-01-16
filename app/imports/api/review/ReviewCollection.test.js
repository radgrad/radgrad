/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { ROLE } from '/imports/api/role/Role';
import { Reviews } from '/imports/api/review/ReviewCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { defineSemesters } from '/imports/api/semester/SemesterUtilities';
import { makeSampleOpportunity } from '/imports/api/opportunity/SampleOpportunities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('ReviewCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      defineSemesters();
      const slug = 'sample-opportunity-review';
      const student = makeSampleUser();
      const reviewType = 'opportunity';
      const faculty = makeSampleUser(ROLE.FACULTY);
      const reviewee = makeSampleOpportunity(faculty);
      const semester = 'Fall-2015';
      const rating = 3;
      const comments = 'What a great course to write a test review for!';
      let docID = Reviews.define({
        slug, student, reviewType, reviewee, semester, rating, comments,
      });
      expect(Reviews.isDefined(docID)).to.be.true;
      const dumpObject = Reviews.dumpOne(docID);
      Reviews.removeIt(docID);
      expect(Reviews.isDefined(slug)).to.be.false;
      docID = Reviews.restoreOne(dumpObject);
      expect(Reviews.isDefined(docID)).to.be.true;
      Reviews.removeIt(docID);
    });
  });
}

