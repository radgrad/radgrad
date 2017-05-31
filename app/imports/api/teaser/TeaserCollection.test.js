import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '../interest/SampleInterests';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

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

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let instanceID = Teasers.define({ title, slug, author, url, description, duration, interests });
      expect(Teasers.isDefined(instanceID)).to.be.true;
      const dumpObject = Teasers.dumpOne(instanceID);
      Teasers.removeIt(instanceID);
      expect(Teasers.isDefined(instanceID)).to.be.false;
      instanceID = Teasers.restoreOne(dumpObject);
      expect(Teasers.isDefined(slug)).to.be.true;
    });
  });
}
