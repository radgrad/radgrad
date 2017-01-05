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
    let slug;
    let description;
    let timestamp;

    before(function setup() {
      removeAllEntities();
      student = makeSampleUser();
      slug = 'feed-test-slug';
      description = 'This is a test slug';
      timestamp = new Date();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = Feed.define({ student, slug, description, timestamp });
      expect(Feed.isDefined(instanceID)).to.be.true;
      Feed.removeIt(instanceID);
      expect(Feed.isDefined(instanceID)).to.be.false;
    });
  });
}
