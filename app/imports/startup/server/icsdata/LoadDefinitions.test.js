/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

// import { loadDefinitions } from '/imports/startup/server/icsdata/LoadDefinitions';
import { Meteor } from 'meteor/meteor';
import { loadDefinitions } from '/imports/startup/server/icsdata/LoadDefinitions';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('LoadDefinitions', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('loadDefinitions', function test() {
      this.timeout(10000);
      loadDefinitions();
    });
  });
}
