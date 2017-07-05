import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { FacultyProfiles } from './FacultyProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FacultyProfileCollection Meteor Methods TestBatch2', function test() {
    const collectionName = FacultyProfiles.getCollectionName();
    const username = 'esb@hawaii.edu';
    const firstName = 'Edo';
    const lastName = 'Biagioni';
    const picture = 'esb.jpg';
    const website = 'http://esb.github.io';
    const interests = [];
    const careerGoals = [];

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal'], done);
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
          const id = FacultyProfiles.getID(username);
          updateMethod.call({ collectionName, updateData: { id, picture: 'esb2.jpg' } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = FacultyProfiles.getID(username);
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
