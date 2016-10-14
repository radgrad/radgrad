/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Slugs } from './SlugCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('SlugCollection', function testSuite() {
    const name = 'testSlugName';
    const entityName = 'testEntityName';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #removeIt, #isDefined', function test() {
      Slugs.define({ name, entityName });
      expect(Slugs.isDefined(name)).to.be.true;
      Slugs.removeIt(name);
      expect(Slugs.isDefined(name)).to.be.false;
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
    });
  });
}

