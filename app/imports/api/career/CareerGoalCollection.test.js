import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { CareerGoals } from '../career/CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';
/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */


if (Meteor.isServer) {
  describe('CareerGoalCollection', function testSuite() {
    const name = 'Graduate School';
    const slug = 'graduate-school';
    const description = 'Obtain a M.S. or Ph.D.';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #getSlug, #findNames', function test() {
      const interests = [makeSampleInterest()];
      let docID = CareerGoals.define({ name, slug, description, interests }); // without retired flag
      expect(CareerGoals.isDefined(slug)).to.be.true;
      expect(CareerGoals.getSlug(docID)).to.equal(slug);
      expect(CareerGoals.findNonRetired().length).to.equal(1);
      expect(CareerGoals.findNames([docID])[0]).to.equal(name);
      let dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(slug);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      docID = CareerGoals.restoreOne(dumpObject);
      expect(CareerGoals.isDefined(slug)).to.be.true;
      let doc = CareerGoals.findDocBySlug(slug);
      expect(doc.retired).to.be.undefined;
      CareerGoals.update(docID, { retired: true });
      expect(CareerGoals.findNonRetired().length).to.equal(0);
      dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(slug);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      docID = CareerGoals.restoreOne(dumpObject);
      doc = CareerGoals.findDoc(docID);
      expect(doc.retired).to.be.true;
    });
  });
}

