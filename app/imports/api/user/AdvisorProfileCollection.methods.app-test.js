import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AdvisorProfileCollection Meteor Methods ', function test() {
    const collectionName = AdvisorProfiles.getCollectionName();
    const username = 'glau@hawaii.edu';
    const firstName = 'Gerald';
    const lastName = 'Lau';
    const picture = 'glau.jpg';
    const website = 'http://glau.github.io';
    const interests = [];
    const careerGoals = [];

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals };
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = AdvisorProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, picture: 'glau2.jpg' } });
    });

    it('Remove Method', async function () {
      const instance = AdvisorProfiles.getID(username);
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
