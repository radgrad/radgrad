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
      let docID = Teasers.define({ title, slug, author, url, description, duration, interests, opportunity });
      expect(Teasers.isDefined(docID)).to.be.true;
      let dumpObject = Teasers.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(Teasers.findNonRetired().length).to.equal(1);
      Teasers.update(docID, { retired: true });
      expect(Teasers.findNonRetired().length).to.equal(0);
      Teasers.removeIt(docID);
      expect(Teasers.isDefined(docID)).to.be.false;
      docID = Teasers.restoreOne(dumpObject);
      expect(Teasers.isDefined(slug)).to.be.true;
      Teasers.update(docID, { retired: true });
      dumpObject = Teasers.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
    });
  });
}
