import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Users } from './UserCollection';
import { validUserAccountsDefineMethod } from './ValidUserAccountCollection.methods';
import { ROLE } from '../role/Role';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('UserCollection Meteor Methods', function test() {
    const collectionName = 'UserCollection';
    const definitionData = {
      firstName: 'Joe',
      lastName: 'Smith',
      slug: 'joesmith',
      email: 'joesmith@hawaii.edu',
      role: ROLE.STUDENT,
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'opportunities'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          validUserAccountsDefineMethod.call({ username: definitionData.slug }, () => {
            defineMethod.call({ collectionName, definitionData }, done);
          });
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = Users.findIdBySlug(definitionData.slug);
          const lastName = 'Smith, Jr.';
          updateMethod.call({ collectionName, updateData: { id, lastName } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
    });
  });
}
