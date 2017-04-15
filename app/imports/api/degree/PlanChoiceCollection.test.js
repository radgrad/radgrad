import { Meteor } from 'meteor/meteor';
import { PlanChoices } from '/imports/api/degree/PlanChoiceCollection';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceCollection', function testSuite() {
    const planChoice = [
      { choices: [{ choice: ['ics111'] }] },
      { choices: [{ choice: ['ics141'] }] },
      { choices: [{ choice: ['ics211'] }] },
      { choices: [{ choice: ['ics241'] }] },
      { choices: [{ choice: ['ics311'] }] },
      { choices: [{ choice: ['ics314'] }] },
      { choices: [{ choice: ['ics212'] }] },
      { choices: [{ choice: ['ics321'] }] },
      { choices: [{ choice: ['ics313', 'ics361'] }] },
      { choices: [{ choice: ['ics312', 'ics331'] }] },
      { choices: [{ choice: ['ics332'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
    ];

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const docID = PlanChoices.define({
        planChoice,
      });
      expect(PlanChoices.isDefined(docID)).to.be.true;
      const dumpObject = PlanChoices.dumpOne(docID);
      PlanChoices.removeIt(docID);
      expect(PlanChoices.isDefined(docID)).to.be.false;
      const planID = PlanChoices.restoreOne(dumpObject);
      expect(PlanChoices.isDefined(planID)).to.be.true;
    });
  });
}

