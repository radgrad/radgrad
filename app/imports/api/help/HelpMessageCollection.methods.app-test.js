import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { HelpMessages } from './HelpMessageCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('HelpMessageCollection Meteor Methods  TestBatch1', function test() {
    const collectionName = HelpMessages.getCollectionName();
    const routeName = 'Admin_Database_Dump_Page';
    const definitionData = {
      routeName,
      title: 'Admin Database Dump Page',
      text: 'help!',
    };

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
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = HelpMessages.findDocByRouteName(routeName)._id;
          const title = 'new title';
          const text = 'new help text';
          updateMethod.call({ collectionName, updateData: { id, title, text } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = HelpMessages.findDocByRouteName(routeName)._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
