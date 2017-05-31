import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { Reviews } from '../review/ReviewCollection';
import { defineSemesters } from '../semester/SemesterUtilities';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

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

