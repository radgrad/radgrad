import { Meteor } from 'meteor/meteor';
import { PlanChoices } from '/imports/api/degree/PlanChoiceCollection';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceCollection', function testSuite() {
    const simple = 'ics111';
    const choice = 'ics313,ics361';
    const complex = 'ics321,ics332,(ics415,ics351)';
    const complex2 = '(ics312,ics331),(ics313,ics361),ics355';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #toStringFromSlug', function test() {
      const docID = PlanChoices.define(simple);
      expect(PlanChoices.isDefined(docID)).to.be.true;
      const dumpObject = PlanChoices.dumpOne(docID);
      PlanChoices.removeIt(docID);
      expect(PlanChoices.isDefined(docID)).to.be.false;
      const planID = PlanChoices.restoreOne(dumpObject);
      expect(PlanChoices.isDefined(planID)).to.be.true;
      const choiceID = PlanChoices.define(choice);
      expect(PlanChoices.isDefined(choiceID)).to.be.true;
      const complexID = PlanChoices.define(complex);
      expect(PlanChoices.isDefined(complexID)).to.be.true;
      expect(PlanChoices.toStringFromSlug(simple) === 'ICS 111').to.be.true;
      expect(PlanChoices.toStringFromSlug(choice) === 'ICS 313 or ICS 361').to.be.true;
      expect(PlanChoices.toStringFromSlug(complex) === 'ICS 321 or ICS 332 or (ICS 415 or ICS 351)').to.be.true;
      expect(PlanChoices.toStringFromSlug(complex2) ===
          '(ICS 312 or ICS 331) or (ICS 313 or ICS 361) or ICS 355').to.be.true;
    });
  });
}

