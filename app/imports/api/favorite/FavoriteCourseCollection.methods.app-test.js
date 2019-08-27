import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { FavoriteCourses } from './FavoriteCourseCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FavoriteCourseCollection', function testSuite() {
    const collectionName = FavoriteCourses.getCollectionName();
    const definitionData = {
      course: 'ics_141',
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
      expect(FavoriteCourses.isDefined(docID), 'define: isDefined').to.be.true;
      expect(FavoriteCourses.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(FavoriteCourses.countNonRetired()).to.equal(0);
      expect(FavoriteCourses.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(FavoriteCourses.countNonRetired()).to.equal(0);
      expect(FavoriteCourses.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
