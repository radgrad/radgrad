import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { moment } from 'meteor/momentjs:moment';
import { Users } from '../user/UserCollection';
import { IceSnapshot } from './IceSnapshotCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('IceSnapshotCollection', function testSuite() {
    let username;
    let level;
    let i;
    let c;
    let e;

    before(function setup() {
      removeAllEntities();
      const userID = makeSampleUser();
      username = Users.getProfile(userID).username;
      level = 1;
      i = 100;
      c = 100;
      e = 100;
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const docID = IceSnapshot.define({ username, level, i, c, e, updated: moment().toDate() });
      expect(IceSnapshot.isDefined(docID)).to.be.true;
      IceSnapshot.removeIt(docID);
      expect(IceSnapshot.isDefined(docID)).to.be.false;
    });
  });
}
