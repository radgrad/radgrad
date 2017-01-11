/**
 * Created by ataka on 12/15/16.
 */

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { Feed } from './FeedCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';

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

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = Feed.define({ student, feedType, timestamp });
      expect(Feed.isDefined(instanceID)).to.be.true;
      Feed.removeIt(instanceID);
      expect(Feed.isDefined(instanceID)).to.be.false;
    });
  });
}
