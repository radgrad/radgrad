/**
 * Created by Cam on 12/7/2016.
 */
/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { HelpMessages } from './HelpMessageCollection';

if (Meteor.isServer) {
  describe('HelpMessageCollection', function testSuite() {
    // Define course data.
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

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = HelpMessages.define({ routeName, title, text });
      expect(HelpMessages.isDefined(instanceID)).to.be.true;
      HelpMessages.removeIt(instanceID);
      expect(HelpMessages.isDefined(instanceID)).to.be.false;
    });
  });
}
