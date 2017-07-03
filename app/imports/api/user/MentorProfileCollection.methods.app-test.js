import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorProfiles } from './MentorProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorProfileCollection Meteor Methods', function test() {
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
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals, company,
            career, location, linkedin, motivation };
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = MentorProfiles.getID(username);
          updateMethod.call({ collectionName, updateData: { id, company: 'Google, Inc.' } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = MentorProfiles.getID(username);
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
