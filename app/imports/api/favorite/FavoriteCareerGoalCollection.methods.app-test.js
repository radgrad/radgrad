import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { FavoriteCareerGoals } from './FavoriteCareerGoalCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FavoriteCareerGoalCollection', function testSuite() {
    const collectionName = FavoriteCareerGoals.getCollectionName();
    const definitionData = {
      careerGoal: 'data-scientist',
      student: 'abi@hawaii.edu',
    };
    const updateData = { retired: true };

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('#define, #update, #removeIt Methods', async function test() {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(FavoriteCareerGoals.isDefined(docID), 'define: isDefined').to.be.true;
      expect(FavoriteCareerGoals.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(FavoriteCareerGoals.countNonRetired()).to.equal(0);
      expect(FavoriteCareerGoals.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(FavoriteCareerGoals.countNonRetired()).to.equal(0);
      expect(FavoriteCareerGoals.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
