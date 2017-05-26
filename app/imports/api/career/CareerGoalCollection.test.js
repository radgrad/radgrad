/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { CareerGoals } from '../career/CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';

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
      const docID = CareerGoals.define({ name, slug, description, interests });
      expect(CareerGoals.isDefined(slug)).to.be.true;
      expect(CareerGoals.getSlug(docID)).to.equal(slug);
      expect(CareerGoals.findNames([docID])[0]).to.equal(name);
      const dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(slug);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      CareerGoals.restoreOne(dumpObject);
      expect(CareerGoals.isDefined(slug)).to.be.true;
    });
  });
}

