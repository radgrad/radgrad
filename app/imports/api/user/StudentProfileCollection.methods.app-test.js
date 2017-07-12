import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { StudentProfiles } from './StudentProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('StudentProfileCollection Meteor Methods ', function test() {
    const collectionName = StudentProfiles.getCollectionName();
    const username = 'amytaka';
    const firstName = 'Amy';
    const lastName = 'Takayesu';
    const picture = 'amytaka.jpg';
    const website = 'http://amytaka.github.io';
    const interests = [];
    const careerGoals = [];
    const level = 6;

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals, level };
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = StudentProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, level: 4 } });
    });

    it('Remove Method', async function () {
      const instance = StudentProfiles.getID(username);
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
