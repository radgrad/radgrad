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
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define (new user), #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const feedType = 'new-user';
      const user = Users.findDoc(makeSampleUser()).username;
      const timestamp = Date.now();
      let docID = Feeds.define({ feedType, user, timestamp });
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
