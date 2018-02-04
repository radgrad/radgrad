import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { calcLevel, defaultCalcLevel } from './LevelProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { ROLE } from '../role/Role';

/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off' */
/* eslint-env mocha */

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

    it.skip('Level 1 Student', function test() {
      studentID = StudentProfiles.define({
        firstName: 'Level',
        lastName: 'One',
        slug: 'levelone',
        email: 'levelone@hawaii.edu',
        role: ROLE.STUDENT,
        password: 'foo',
      });
      let level;
      if (Meteor.settings.public.level.use_hidden) {
        level = calcLevel(studentID);
      } else {
        level = defaultCalcLevel(studentID);
      }
      expect(level).to.equal(1);
    });
  });
}
