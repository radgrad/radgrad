import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { Feeds } from './FeedCollection';
import { Users } from '../user/UserCollection';
import { makeSampleUser } from '../user/SampleUsers';

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

    it('#defineNewUser, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Feeds.defineNewUser({ user, feedType, timestamp });
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
