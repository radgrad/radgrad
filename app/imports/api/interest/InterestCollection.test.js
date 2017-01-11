/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { makeSampleInterestType } from '/imports/api/interest/SampleInterests';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('InterestCollection', function testSuite() {
    const name = 'Interest';
    const slug = 'interest-slug';
    const description = 'InterestDescription';
    const name2 = 'Interest2';
    const slug2 = 'interest-slug-2';
    const description2 = 'InterestDescription2';
    let interestType;
    let interest1;
    let interest2;


    before(function setup() {
      removeAllEntities();
      interestType = InterestTypes.findSlugByID(makeSampleInterestType());
      interest1 = { name, slug, description, interestType };
      interest2 = { name: name2, slug: slug2, description: description2, interestType };
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      Interests.define(interest1);
      expect(Interests.isDefined(slug)).to.be.true;
      Interests.removeIt(slug);
      expect(Interests.isDefined(slug)).to.be.false;
    });

    it('#define (multiple definition)', function test() {
      Interests.define(interest1);
      expect(function foo() { Interests.define(interest1); }).to.throw(Error);
      Interests.removeIt(slug);
    });

    it('#assertDefined, assertAllDefined', function test() {
      const docID = Interests.define(interest1);
      expect(function foo() { Interests.assertDefined(docID); }).to.not.throw(Error);
      expect(function foo() { Interests.assertDefined('foo'); }).to.throw(Error);
      const docID2 = Interests.define(interest2);
      expect(function foo() { Interests.assertAllDefined([docID, docID2]); }).to.not.throw(Error);
      expect(function foo() { Interests.assertAllDefined(['foo']); }).to.throw(Error);
      Interests.removeIt(slug);
      Interests.removeIt(slug2);
    });

    it('#find, #findDoc, #findDocBySlug, #findIdBySlug, #findIdsBySlugs, #findNames', function test() {
      const docID = Interests.define(interest1);
      const docID2 = Interests.define(interest2);
      expect(Interests.find().fetch()).to.have.lengthOf(2);
      expect(function foo() { Interests.findDoc(docID); }).to.not.throw(Error);
      expect(function foo() { Interests.findDoc('foo'); }).to.throw(Error);
      expect(function foo() { Interests.findDocBySlug(slug); }).to.not.throw(Error);
      expect(function foo() { Interests.findDocBySlug('foo'); }).to.throw(Error);
      expect(function foo() { Interests.findIdBySlug(slug); }).to.not.throw(Error);
      expect(function foo() { Interests.findIdsBySlugs([slug, slug2]); }).to.not.throw(Error);
      expect(function foo() { Interests.findIdsBySlugs([slug, 'foo']); }).to.throw(Error);
      expect(function foo() { Interests.findNames([docID, docID2]); }).to.not.throw(Error);
      expect(function foo() { Interests.findNames([docID, 'foo']); }).to.throw(Error);
      Interests.removeIt(slug);
      Interests.removeIt(slug2);
    });

    it('#hasSlug', function test() {
      const docID = Interests.define(interest1);
      const slugID = Interests.findDoc(docID).slugID;
      expect(Interests.hasSlug(slugID)).to.be.true;
      expect(Interests.hasSlug('foo')).to.be.false;
      Interests.removeIt(slug);
    });
  });
}

