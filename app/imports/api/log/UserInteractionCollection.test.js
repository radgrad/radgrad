import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { UserInteractions } from './UserInteractionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('UserInteractionCollection', function testSuite() {
    let userID;
    let type;
    let typeData;

    before(function setup() {
      removeAllEntities();
      userID = makeSampleUser();
      type = 'interestIDs';
      typeData = '0123456789';
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = UserInteractions.define({ userID, type, typeData });
      expect(UserInteractions.isDefined(docID)).to.be.true;
      const dumpObject = UserInteractions.dumpOne(docID);
      UserInteractions.removeIt(docID);
      expect(UserInteractions.isDefined(docID)).to.be.false;
      docID = UserInteractions.restoreOne(dumpObject);
      expect(UserInteractions.isDefined(docID)).to.be.true;
      const error = UserInteractions.checkIntegrity();
      expect(error.length).to.equal(0);
      UserInteractions.removeIt(docID);
    });
    it('#removeUser', function test() {
      const docID = UserInteractions.define({ userID, type, typeData });
      expect(UserInteractions.isDefined(docID)).to.be.true;
      const secDocID = UserInteractions.define({ userID, type, typeData });
      expect(UserInteractions.isDefined(secDocID)).to.be.true;
      UserInteractions.removeUser(userID);
      expect(UserInteractions.isDefined(docID)).to.be.false;
      expect(UserInteractions.isDefined(secDocID)).to.be.false;
    });
  });
}
