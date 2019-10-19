import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { InterestTypes } from './InterestTypeCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestTypeCollection', function testSuite() {
    const name = 'Interest Name';
    const slug = 'interest-slug';
    const description = 'Interest Description';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = InterestTypes.define({ name, slug, description });
      expect(InterestTypes.isDefined(slug)).to.be.true;
      let dumpObject = InterestTypes.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(InterestTypes.findNonRetired().length).to.equal(1);
      InterestTypes.update(docID, { retired: true });
      expect(InterestTypes.findNonRetired().length).to.equal(0);
      InterestTypes.removeIt(slug);
      expect(InterestTypes.isDefined(slug)).to.be.false;
      docID = InterestTypes.restoreOne(dumpObject);
      expect(InterestTypes.isDefined(slug)).to.be.true;
      InterestTypes.update(docID, { retired: true });
      dumpObject = InterestTypes.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      InterestTypes.removeIt(slug);
    });

    it('#define (multiple definition)', function test() {
      InterestTypes.define({ name, slug, description });
      expect(function foo() { InterestTypes.define({ name, slug, description }); }).to.throw(Error);
      InterestTypes.removeIt(slug);
    });

    it('#findDocBySlug', function test() {
      InterestTypes.define({ name, slug, description });
      const doc = InterestTypes.findDocBySlug(slug);
      expect(doc).to.be.an('object');
      InterestTypes.removeIt(slug);
      expect(function foo() { InterestTypes.findDocBySlug('notASlug'); }).to.throw(Error);
    });

    it('#findDoc', function test() {
      const docID = InterestTypes.define({ name, slug, description });
      const doc = InterestTypes.findDoc(docID);
      expect(doc).to.be.an('object');
      const newDoc = InterestTypes.findDoc(docID);
      expect(newDoc).to.be.an('object');
      InterestTypes.removeIt(slug);
    });

    it('#find', function test() {
      InterestTypes.define({ name, slug, description });
      const docs = InterestTypes.find().fetch();
      expect(docs).to.have.lengthOf(1);
      InterestTypes.removeIt(slug);
    });
  });
}
