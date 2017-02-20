import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { Feed } from './FeedCollection';
import { Users } from '/imports/api/user/UserCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedCollection', function testSuite() {
    // Define course data.
    let user;
    let feedType;
    let timestamp;

    before(function setup() {
      removeAllEntities();
      user = [Users.findDoc(makeSampleUser()).username];
      feedType = 'new-user';
      timestamp = Date.now();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Feed.define({ user, feedType, timestamp });
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
