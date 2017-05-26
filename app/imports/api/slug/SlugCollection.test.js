/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import { Slugs } from './SlugCollection';
import { removeAllEntities } from '../base/BaseUtilities';

if (Meteor.isServer) {
  describe('SlugCollection', function testSuite() {
    const name = 'testSlugName';
    const entityName = 'testEntityName';

    before(function setup() {
      removeAllEntities();
      Slugs.removeAll();
    });

    after(function teardown() {
      removeAllEntities();
      Slugs.removeAll();
    });

    it('#isValidSlugName', function test() {
      expect(Slugs.isValidSlugName('slug123')).to.be.true;
      expect(Slugs.isValidSlugName('slug-123')).to.be.true;
      expect(Slugs.isValidSlugName('Slug-123')).to.be.true;
      expect(Slugs.isValidSlugName('slug-123#')).to.be.false;
      expect(Slugs.isValidSlugName('slug 123')).to.be.false;
      expect(Slugs.isValidSlugName('slug_123')).to.be.true;
      expect(Slugs.isValidSlugName('')).to.be.false;
      expect(Slugs.isValidSlugName(12)).to.be.false;
    });

    it('#define, #removeIt, #isDefined, #dumpOne, #restoreOne, #checkIntegrity, #hasSlug', function test() {
      const docID = Slugs.define({ name, entityName });
      expect(Slugs.isDefined(name)).to.be.true;
      const dumpObject = Slugs.dumpOne(docID);
      Slugs.removeIt(name);
      expect(Slugs.isDefined(name)).to.be.false;
      Slugs.restoreOne(dumpObject);
      expect(Slugs.isDefined(name)).to.be.true;
      const error = Slugs.checkIntegrity();
      expect(error.length).to.equal(0);
      expect(Slugs.hasSlug(docID)).to.be.false;
      Slugs.removeIt(name);
    });

    it('#define (multiple definition)', function test() {
      Slugs.define({ name, entityName });
      expect(function foo() { Slugs.define(name, entityName); }).to.throw(Error);
      Slugs.removeIt(name);
    });

    it('#findDoc', function test() {
      Slugs.define({ name, entityName });
      const doc = Slugs.findDoc(name);
      expect(doc).to.be.an('object');
      const newDoc = Slugs.findDoc(doc);
      expect(newDoc).to.be.an('object');
      Slugs.removeIt(name);
    });

    it('#getType, #toString, #assertSlug', function test() {
      Slugs.define({ name, entityName });
      Slugs.assertSlug(name);
      expect(Slugs.getType()).to.equal('Slug');
      expect(Slugs.toString()).to.have.lengthOf(1);
      Slugs.removeIt(name);
    });

    it('#getNameFromID, #isSlugForEntity, #getEntityID, #updateEntityID', function test() {
      const slugID = Slugs.define({ name, entityName });
      expect(Slugs.getNameFromID(slugID)).to.equal(name);
      expect(Slugs.isSlugForEntity(name, entityName)).to.be.true;
      let entityID = Slugs.getEntityID(name, entityName);
      expect(entityID).to.be.undefined;
      entityID = Random.id();
      Slugs.updateEntityID(slugID, entityID);
      expect(Slugs.getEntityID(name, entityName)).to.be.equal(entityID);
      Slugs.removeIt(name);
    });
  });
}

