import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { makeSampleOpportunity } from '/imports/api/opportunity/SampleOpportunities.js';
import { makeSampleUser } from '/imports/api/user/SampleUsers.js';
import { ROLE } from '/imports/api/role/Role';


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
    let opportunity;

    before(function setup() {
      removeAllEntities();
      title = 'Teaser Test Title';
      slug = 'teaser-test-title';
      author = 'Amy';
      url = 'http://www.youtube.com/sample';
      description = 'This is a test teaser';
      duration = '1:32:14';
      interests = [makeSampleInterest()];
      //opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
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
