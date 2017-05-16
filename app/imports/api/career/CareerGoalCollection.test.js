/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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
    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const interests = [makeSampleInterest()];
      const docID = CareerGoals.define({ name, slug, description, interests });
      expect(CareerGoals.isDefined(slug)).to.be.true;
      const dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(slug);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      CareerGoals.restoreOne(dumpObject);
      expect(CareerGoals.isDefined(slug)).to.be.true;
    });
  });
}

