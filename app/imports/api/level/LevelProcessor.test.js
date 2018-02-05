import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { defaultCalcLevel } from './LevelProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { RadGrad } from '../radgrad/RadGrad';

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

    it('Level 1 Student', function test() {
      studentID = StudentProfiles.define({
        username: 'levelone@hawaii.edu',
        firstName: 'Level',
        lastName: 'One',
        level: 6,
      });
      let level;
      if (RadGrad.calcLevel) {
        level = RadGrad.calcLevel(studentID);
      } else {
        level = defaultCalcLevel(studentID);
      }
      expect(level).to.equal(1);
    });
  });
}
