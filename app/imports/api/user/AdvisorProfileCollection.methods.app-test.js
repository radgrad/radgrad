import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AdvisorProfileCollection Meteor Methods', function test() {
    const collectionName = AdvisorProfiles.getCollectionName();
    const username = 'glau@hawaii.edu';
    const firstName = 'Gerald';
    const lastName = 'Lau';
    const picture = 'glau.jpg';
    const website = 'http://glau.github.io';
    const interests = [];
    const careerGoals = [];

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
          const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals };
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = AdvisorProfiles.getID(username);
          updateMethod.call({ collectionName, updateData: { id, picture: 'glau2.jpg' } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = AdvisorProfiles.getID(username);
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
