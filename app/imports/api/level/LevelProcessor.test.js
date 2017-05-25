/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off' */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { calcLevel } from './LevelProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { ROLE } from '../role/Role';

// TODO: Waiting for test data based upon the Personae.

if (Meteor.isServer) {
  describe('LevelProcessor Tests', function testSuite() {
    let studentID;

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Level 1 Student', function test() {
      studentID = Users.define({
        firstName: 'Level',
        lastName: 'One',
        slug: 'levelone',
        email: 'levelone@hawaii.edu',
        role: ROLE.STUDENT,
        password: 'foo',
      });
      const level = calcLevel(studentID);
      expect(level).to.equal(1);
    });
  });
}
