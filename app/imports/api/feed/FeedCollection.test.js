import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { Feed } from './FeedCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedCollection', function testSuite() {
    // Define course data.
    let student;
    let feedType;
    let timestamp;

    before(function setup() {
      removeAllEntities();
      student = makeSampleUser();
      feedType = 'new';
      timestamp = Date.now();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Feed.define({ student, feedType, timestamp });
      expect(Feed.isDefined(docID)).to.be.true;
      const dumpObject = Feed.dumpOne(docID);
      Feed.removeIt(docID);
      expect(Feed.isDefined(docID)).to.be.false;
      docID = Feed.restoreOne(dumpObject);
      expect(Feed.isDefined(docID)).to.be.true;
      Feed.removeIt(docID);
    });
  });
}
