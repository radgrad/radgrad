import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { FacultyProfiles } from './FacultyProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FacultyProfileCollection Meteor Methods ', function test() {
    const collectionName = FacultyProfiles.getCollectionName();
    const username = 'esb@hawaii.edu';
    const firstName = 'Edo';
    const lastName = 'Biagioni';
    const picture = 'esb.jpg';
    const website = 'http://esb.github.io';
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
      const id = FacultyProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, picture: 'esb2.jpg' } });
    });

    it('Remove Method', async function () {
      const instance = FacultyProfiles.getID(username);
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
