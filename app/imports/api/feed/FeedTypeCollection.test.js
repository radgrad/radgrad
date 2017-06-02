import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FeedTypes } from './FeedTypeCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedTypeCollection', function testSuite() {
    const name = 'New Course';
    const slug = 'new-course';
    const description = 'A new course has been added';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      FeedTypes.define({ name, slug, description });
      expect(FeedTypes.isDefined(slug)).to.be.true;
      FeedTypes.removeIt(slug);
      expect(FeedTypes.isDefined(slug)).to.be.false;
    });

    it('#define (multiple definition)', function test() {
      FeedTypes.define({ name, slug, description });
      expect(function foo() { FeedTypes.define({ name, slug, description }); }).to.throw(Error);
      FeedTypes.removeIt(slug);
    });

    it('#findDocBySlug', function test() {
      FeedTypes.define({ name, slug, description });
      const doc = FeedTypes.findDocBySlug(slug);
      expect(doc).to.be.an('object');
      FeedTypes.removeIt(slug);
      expect(function foo() { FeedTypes.findDocBySlug('notASlug'); }).to.throw(Error);
    });

    it('#findDoc', function test() {
      const docID = FeedTypes.define({ name, slug, description });
      const doc = FeedTypes.findDoc(docID);
      expect(doc).to.be.an('object');
      FeedTypes.removeIt(slug);
    });

    it('#find', function test() {
      FeedTypes.define({ name, slug, description });
      const docs = FeedTypes.find().fetch();
      expect(docs).to.have.lengthOf(1);
      FeedTypes.removeIt(slug);
    });
  });
}

