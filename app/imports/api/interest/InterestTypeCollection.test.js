/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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

    it('#define, #isDefined, #removeIt', function test() {
      InterestTypes.define({ name, slug, description });
      expect(InterestTypes.isDefined(slug)).to.be.true;
      InterestTypes.removeIt(slug);
      expect(InterestTypes.isDefined(slug)).to.be.false;
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

