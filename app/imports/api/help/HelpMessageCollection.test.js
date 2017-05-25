import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { HelpMessages } from './HelpMessageCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('HelpMessageCollection', function testSuite() {
    let routeName;
    let title;
    let text;

    before(function setup() {
      removeAllEntities();
      routeName = 'Test_Route_Name';
      title = 'Test title';
      text = 'This is a sample help message.';
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let instanceID = HelpMessages.define({ routeName, title, text });
      expect(HelpMessages.isDefined(instanceID)).to.be.true;
      const dumpObject = HelpMessages.dumpOne(instanceID);
      HelpMessages.removeIt(instanceID);
      expect(HelpMessages.isDefined(instanceID)).to.be.false;
      instanceID = HelpMessages.restoreOne(dumpObject);
      expect(HelpMessages.isDefined(instanceID)).to.be.true;
      HelpMessages.removeIt(instanceID);
    });
  });
}
