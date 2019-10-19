import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('OpportunityTypeCollection', function testSuite() {
    const name = 'InternshipOpportunity';
    const slug = 'internship-slug';
    const description = 'Work in a real-world setting for a semester or summer.';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      let docID = OpportunityTypes.define({ name, slug, description });
      expect(OpportunityTypes.isDefined(slug)).to.be.true;
      let dumpObject = OpportunityTypes.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(OpportunityTypes.findNonRetired().length).to.equal(1);
      OpportunityTypes.update(docID, { retired: true });
      expect(OpportunityTypes.findNonRetired().length).to.equal(0);
      OpportunityTypes.removeIt(slug);
      expect(OpportunityTypes.isDefined(slug)).to.be.false;
      docID = OpportunityTypes.restoreOne(dumpObject);
      expect(OpportunityTypes.isDefined(docID)).to.be.true;
      OpportunityTypes.update(docID, { retired: true });
      dumpObject = OpportunityTypes.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      OpportunityTypes.removeIt(docID);
    });

    it('#define (multiple definition)', function test() {
      OpportunityTypes.define({ name, slug, description });
      expect(function foo() { OpportunityTypes.define({ name, slug, description }); }).to.throw(Error);
      OpportunityTypes.removeIt(slug);
    });

    it('#findDocBySlug', function test() {
      OpportunityTypes.define({ name, slug, description });
      const doc = OpportunityTypes.findDocBySlug(slug);
      expect(doc).to.be.an('object');
      OpportunityTypes.removeIt(slug);
      expect(function foo() { OpportunityTypes.findDocBySlug('notASlug'); }).to.throw(Error);
    });

    it('#findDoc', function test() {
      const docID = OpportunityTypes.define({ name, slug, description });
      const doc = OpportunityTypes.findDoc(docID);
      expect(doc).to.be.an('object');
      OpportunityTypes.removeIt(slug);
    });

    it('#find', function test() {
      OpportunityTypes.define({ name, slug, description });
      const docs = OpportunityTypes.find().fetch();
      expect(docs).to.have.lengthOf(1);
      OpportunityTypes.removeIt(slug);
    });
  });
}
