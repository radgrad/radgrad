import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { PlanChoices } from './PlanChoiceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('PlanChoiceCollection Meteor Methods ', function test() {
    const collectionName = PlanChoices.getCollectionName();
    const choice = 'ics211,ics215-1';
    const definitionData = { choice };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = PlanChoices.findOne()._id;
      const newChoice = 'ics314-1';
      await updateMethod.callPromise({ collectionName, updateData: { id, choice: newChoice } });
    });

    it('Remove Method', async function () {
      const instance = PlanChoices.findOne()._id;
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
