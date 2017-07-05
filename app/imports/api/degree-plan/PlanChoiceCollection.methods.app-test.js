import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { PlanChoices } from './PlanChoiceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('PlanChoiceCollection Meteor Methods  TestBatch1', function test() {
    const collectionName = PlanChoices.getCollectionName();
    const choice = 'ics211,ics215-1';
    const definitionData = {
      choice,
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = PlanChoices.findOne()._id;
          const newChoice = 'ics314-1';
          updateMethod.call({ collectionName, updateData: { id, choice: newChoice } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = PlanChoices.findOne()._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
