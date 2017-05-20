import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PreferredChoice', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('empty until get fixture.', function test() {
      expect(true).to.be.true;
    });
  });
}
