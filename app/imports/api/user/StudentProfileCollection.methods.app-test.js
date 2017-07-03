import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { StudentProfiles } from './StudentProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('StudentProfileCollection Meteor Methods', function test() {
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
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals, level };
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = StudentProfiles.getID(username);
          updateMethod.call({ collectionName, updateData: { id, level: 4 } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = StudentProfiles.getID(username);
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
