/**
 * Created by ataka on 12/15/16.
 */

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';

if (Meteor.isServer) {
  describe('TeaserCollection', function testSuite() {
    // Define course data.
    let title;
    let slug;
    let author;
    let url;
    let description;
    let duration;
    let interests;

    before(function setup() {
      removeAllEntities();
      title = 'Teaser Test Title';
      slug = 'teaser-test-title';
      author = 'Amy';
      url = 'http://www.youtube.com/sample';
      description = 'This is a test teaser';
      duration = '1:32:14';
      interests = [makeSampleInterest()];
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = Teasers.define({ title, slug, author, url, description, duration, interests });
      expect(Teasers.isDefined(instanceID)).to.be.true;
      Teasers.removeIt(instanceID);
      expect(Teasers.isDefined(instanceID)).to.be.false;
    });
  });
}
