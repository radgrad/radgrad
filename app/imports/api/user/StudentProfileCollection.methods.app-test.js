import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Tracker } from 'meteor/tracker';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { StudentProfiles } from './StudentProfileCollection';
import {
  defineTestFixturesMethod,
  withRadGradSubscriptions,
  withLoggedInUser,
  denodeify,
} from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const delay = 500;

if (Meteor.isClient) {
  describe('StudentProfileCollection Meteor Methods ', function test() {
    this.timeout(5000);
    const collectionName = StudentProfiles.getCollectionName();
    const username = 'amytaka@foo.com';
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
      const profileID = await defineMethod.callPromise({ collectionName, definitionData });
      await sleep(delay); // give the system time to propagate the changes
      const profile = StudentProfiles.findDoc({ _id: profileID });
      // console.log(profileID, profile);
      expect(profile.username).to.equal(username);
      expect(profile.level).to.equal(level);
      expect(profile.userID).to.not.equal(StudentProfiles.getFakeUserId());
    });

    it('Update Method', async function () {
      const id = StudentProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, level: 4 } });
      await sleep(delay); // give the system time to propagate the changes
      const profile = StudentProfiles.findDoc({ _id: id });
      expect(profile.level).to.equal(4);
      // console.log(profile);
    });

    it('Remove Method', async function () {
      const instance = StudentProfiles.getID(username);
      // const profile = StudentProfiles.findDoc({ username });
      // console.log(instance, profile);
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
