import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Feeds } from './FeedCollection';
import { Users } from '../user/UserCollection';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { makeSampleCourse } from '../course/SampleCourses';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define (new-user), #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const feedType = Feeds.NEW_USER;
      const user = Users.getProfile(makeSampleUser()).username;
      const timestamp = Date.now();
      let docID = Feeds.define({ feedType, user, timestamp });
      expect(Feeds.isDefined(docID)).to.be.true;
      let dumpObject = Feeds.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(Feeds.findNonRetired().length).to.equal(1);
      Feeds.update(docID, { retired: true });
      expect(Feeds.findNonRetired().length).to.equal(0);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      Feeds.update(docID, { retired: true });
      dumpObject = Feeds.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      Feeds.removeIt(docID);
    });

    it('#define (multiple new-user)', function test() {
      const feedType = Feeds.NEW_USER;
      const user1 = Users.getProfile(makeSampleUser()).username;
      const user2 = Users.getProfile(makeSampleUser()).username;
      const docID1 = Feeds.define({ feedType, user: user1 });
      const docID2 = Feeds.define({ feedType, user: user2 });
      expect(Feeds.isDefined(docID1)).to.be.true;
      expect(Feeds.isDefined(docID2)).to.be.true;
      expect(docID1).to.equal(docID2);
      // make sure we can dump and restore it.
      const dumpObject = Feeds.dumpOne(docID1);
      Feeds.removeIt(docID1);
      expect(Feeds.isDefined(docID1)).to.be.false;
      const docID3 = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID3)).to.be.true;
      Feeds.removeIt(docID3);
    });

    it('#define (new-course)', function test() {
      const feedType = Feeds.NEW_COURSE;
      const course = Courses.getSlug(makeSampleCourse());
      let docID = Feeds.define({ feedType, course });
      expect(Feeds.isDefined(docID)).to.be.true;
      const dumpObject = Feeds.dumpOne(docID);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      Feeds.removeIt(docID);
    });

    it('#define (new-opportunity)', function test() {
      const feedType = Feeds.NEW_OPPORTUNITY;
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const opportunity = Opportunities.getSlug(makeSampleOpportunity(sponsor));
      let docID = Feeds.define({ feedType, opportunity });
      expect(Feeds.isDefined(docID)).to.be.true;
      const dumpObject = Feeds.dumpOne(docID);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      Feeds.removeIt(docID);
    });

    it('#define (verified-opportunity)', function test() {
      const feedType = Feeds.VERIFIED_OPPORTUNITY;
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const opportunity = Opportunities.getSlug(makeSampleOpportunity(sponsor));
      const user1 = Users.getProfile(makeSampleUser()).username;
      const user2 = Users.getProfile(makeSampleUser()).username;
      const semester = 'Spring-2013';
      const docID1 = Feeds.define({ feedType, user: user1, opportunity, semester });
      const docID2 = Feeds.define({ feedType, user: user2, opportunity, semester });
      expect(Feeds.isDefined(docID1)).to.be.true;
      expect(Feeds.isDefined(docID2)).to.be.true;
      expect(docID1).to.equal(docID2);
      // make sure we can dump and restore it.
      const dumpObject = Feeds.dumpOne(docID1);
      Feeds.removeIt(docID1);
      expect(Feeds.isDefined(docID1)).to.be.false;
      const docID3 = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID3)).to.be.true;
      Feeds.removeIt(docID3);
    });

    it('#define (new-course-review)', function test() {
      const feedType = Feeds.NEW_COURSE_REVIEW;
      const user = Users.getProfile(makeSampleUser()).username;
      const course = Courses.getSlug(makeSampleCourse());
      let docID = Feeds.define({ feedType, user, course });
      expect(Feeds.isDefined(docID)).to.be.true;
      const dumpObject = Feeds.dumpOne(docID);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      Feeds.removeIt(docID);
    });

    it('#define (new-opportunity-review)', function test() {
      const feedType = Feeds.NEW_OPPORTUNITY_REVIEW;
      const user = Users.getProfile(makeSampleUser()).username;
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const opportunity = Opportunities.getSlug(makeSampleOpportunity(sponsor));
      let docID = Feeds.define({ feedType, user, opportunity });
      expect(Feeds.isDefined(docID)).to.be.true;
      const dumpObject = Feeds.dumpOne(docID);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      Feeds.removeIt(docID);
    });
  });
}
