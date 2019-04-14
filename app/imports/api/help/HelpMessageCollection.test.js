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
      let docID = HelpMessages.define({ routeName, title, text });
      expect(HelpMessages.isDefined(docID)).to.be.true;
      let dumpObject = HelpMessages.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(HelpMessages.findNonRetired().length).to.equal(1);
      HelpMessages.update(docID, { retired: true });
      expect(HelpMessages.findNonRetired().length).to.equal(0);
      HelpMessages.removeIt(docID);
      expect(HelpMessages.isDefined(docID)).to.be.false;
      docID = HelpMessages.restoreOne(dumpObject);
      expect(HelpMessages.isDefined(docID)).to.be.true;
      HelpMessages.update(docID, { retired: true });
      dumpObject = HelpMessages.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      expect(HelpMessages.findNonRetired().length).to.equal(0);
      HelpMessages.removeIt(docID);
    });
  });
}
