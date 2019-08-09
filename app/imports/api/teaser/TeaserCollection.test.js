import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Slugs } from '../slug/SlugCollection';
import { makeSampleCourse } from '../course/SampleCourses';
import { Courses } from '../course/CourseCollection';


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
      const opportunityDoc = Opportunities.findDoc(opportunity);
      const opportunitySlug = Slugs.getNameFromID(opportunityDoc.slugID);
      let docID = Teasers.define({ title, slug, author, url, description, duration, interests, opportunity });
      expect(Teasers.isDefined(docID)).to.be.true;
      let dumpObject = Teasers.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(dumpObject.targetSlug).to.equal(opportunitySlug);
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
      const title2 = 'Teaser 2nd Title';
      const slug2 = 'teaser-2nd-title';
      const course = makeSampleCourse();
      const targetSlug = Slugs.getNameFromID(Courses.findDoc(course).slugID);
      docID = Teasers.define({ title: title2, slug: slug2, author, url, description, duration, interests, targetSlug });
      expect(Teasers.isDefined(docID)).to.be.true;
      dumpObject = Teasers.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(dumpObject.targetSlug).to.equal(targetSlug);
    });
  });
}
