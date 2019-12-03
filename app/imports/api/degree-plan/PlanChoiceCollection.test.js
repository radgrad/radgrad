import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { PlanChoices } from './PlanChoiceCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceCollection', function testSuite() {
    const simple = 'ics_111';
    const choice = 'ics_313,ics_361';
    const complex = 'ics_321,ics_332,(ics_415,ics_351)';
    const complex2 = '(ics_312,ics_331),(ics_313,ics_361),ics_355';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #toStringFromSlug', function test() {
      let docID = PlanChoices.define({ choice: simple });
      expect(PlanChoices.isDefined(docID)).to.be.true;
      let dumpObject = PlanChoices.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(PlanChoices.findNonRetired().length).to.equal(1);
      PlanChoices.update(docID, { retired: true });
      expect(PlanChoices.findNonRetired().length).to.equal(0);
      PlanChoices.removeIt(docID);
      expect(PlanChoices.isDefined(docID)).to.be.false;
      docID = PlanChoices.restoreOne(dumpObject);
      expect(PlanChoices.isDefined(docID)).to.be.true;
      PlanChoices.update(docID, { retired: true });
      dumpObject = PlanChoices.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      const choiceID = PlanChoices.define({ choice });
      expect(PlanChoices.isDefined(choiceID)).to.be.true;
      const complexID = PlanChoices.define({ choice: complex });
      expect(PlanChoices.isDefined(complexID)).to.be.true;
      expect(PlanChoices.toStringFromSlug(simple) === 'ICS 111').to.be.true;
      expect(PlanChoices.toStringFromSlug(choice) === 'ICS 313 or ICS 361').to.be.true;
      expect(PlanChoices.toStringFromSlug(complex) === 'ICS 321 or ICS 332 or (ICS 415 or ICS 351)').to.be.true;
      expect(PlanChoices.toStringFromSlug(complex2)
          === '(ICS 312 or ICS 331) or (ICS 313 or ICS 361) or ICS 355').to.be.true;
    });
  });
}
