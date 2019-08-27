import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { FavoriteOpportunities } from './FavoriteOpportunityCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FavoriteOpportunityCollection', function testSuite() {
    const collectionName = FavoriteOpportunities.getCollectionName();
    const definitionData = {
      opportunity: 'acm-icpc',
      student: 'abi@hawaii.edu',
    };
    const updateData = { retired: true };

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('#define, #update, #removeIt Methods', async function test() {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(FavoriteOpportunities.isDefined(docID), 'define: isDefined').to.be.true;
      expect(FavoriteOpportunities.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(FavoriteOpportunities.countNonRetired()).to.equal(0);
      expect(FavoriteOpportunities.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(FavoriteOpportunities.countNonRetired()).to.equal(0);
      expect(FavoriteOpportunities.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
