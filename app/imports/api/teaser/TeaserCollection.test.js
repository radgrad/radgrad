import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';


/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('TeaserCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      // Define teaser data.
      const title = 'Teaser Test Title';
      const slug = 'teaser-test-title';
      const author = 'Amy';
      const url = 'http://www.youtube.com/sample';
      const description = 'This is a test teaser';
      const duration = '1:32:14';
      const interests = [makeSampleInterest()];
      const opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
      let instanceID = Teasers.define({ title, slug, author, url, description, duration, interests, opportunity });
      expect(Teasers.isDefined(instanceID)).to.be.true;
      const dumpObject = Teasers.dumpOne(instanceID);
      Teasers.removeIt(instanceID);
      expect(Teasers.isDefined(instanceID)).to.be.false;
      instanceID = Teasers.restoreOne(dumpObject);
      expect(Teasers.isDefined(slug)).to.be.true;
    });
  });
}
