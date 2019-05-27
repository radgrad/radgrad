import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { UserInteractions } from './UserInteractionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('UserInteractionCollection', function testSuite() {
    let username;
    let type;
    let typeData;

    before(function setup() {
      removeAllEntities();
      const userID = makeSampleUser();
      username = Users.getProfile(userID).username;
      type = 'interestIDs';
      typeData = '0123456789';
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = UserInteractions.define({ username, type, typeData });
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
      const docID = UserInteractions.define({ username, type, typeData });
      expect(UserInteractions.isDefined(docID)).to.be.true;
      const docID2 = UserInteractions.define({ username, type, typeData });
      expect(UserInteractions.isDefined(docID2)).to.be.true;
      UserInteractions.removeUser(username);
      expect(UserInteractions.isDefined(docID)).to.be.false;
      expect(UserInteractions.isDefined(docID2)).to.be.false;
    });
    it('#find, #findDoc', function test() {
      const docID = UserInteractions.define({ username, type, typeData });
      const docID2 = UserInteractions.define({ username, type, typeData });
      expect(UserInteractions.find().fetch()).to.have.lengthOf(2);
      expect(function foo() { UserInteractions.findDoc(docID); }).to.not.throw(Error);
      expect(function foo() { UserInteractions.findDoc(docID2); }).to.not.throw(Error);
      expect(function foo() { UserInteractions.findDoc('foo'); }).to.throw(Error);
      UserInteractions.removeIt(docID);
      UserInteractions.removeIt(docID2);
    });
  });
}
