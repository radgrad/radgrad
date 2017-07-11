import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorProfiles } from './MentorProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorProfileCollection Meteor Methods ', function test() {
    const collectionName = MentorProfiles.getCollectionName();
    const username = 'rbrewer@tableau.com';
    const firstName = 'Robert';
    const lastName = 'Brewer';
    const picture = 'foo.jpg';
    const website = 'http://rbrewer.github.io';
    const interests = [];
    const careerGoals = [];
    const company = 'Tableau Inc';
    const career = 'Software Engineer';
    const location = 'San Francisco, CA';
    const linkedin = 'robertsbrewer';
    const motivation = 'Help future students.';

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = {
        username, firstName, lastName, picture, website, interests, careerGoals, company,
        career, location, linkedin, motivation,
      };
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = MentorProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, company: 'Google, Inc.' } });
    });

    it('Remove Method', async function () {
      const instance = MentorProfiles.getID(username);
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
