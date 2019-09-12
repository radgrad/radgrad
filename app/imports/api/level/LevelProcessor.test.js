import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { defaultCalcLevel, getLevelCriteriaStringMarkdown } from './LevelProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { RadGrad } from '../radgrad/RadGrad';
import { defineTestFixtures } from '../test/test-utilities';

/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off' */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('LevelProcessor Tests', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Level 1 Student', function test() {
      const profileID = StudentProfiles.define({
        username: 'levelone@hawaii.edu',
        firstName: 'Level',
        lastName: 'One',
        level: 6,
      });
      const profile = StudentProfiles.findDoc(profileID);
      let level;
      if (RadGrad.calcLevel) {
        level = RadGrad.calcLevel(profile.userID);
      } else {
        level = defaultCalcLevel(profile.userID);
      }
      expect(level)
        .to
        .equal(1);
    });

    it('Betty Level 1', function levelOne() {
      this.timeout(5000);
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(bettyProfile).to.exist;
      const level = defaultCalcLevel(bettyProfile.userID);
      expect(level)
        .to
        .equal(1); // no ice points
      defineTestFixtures(['betty.level1']); // one A [0, 10, 0]
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(1);
    });

    it('Betty Level 2', function levelTwo() {
      this.timeout(5000);
      defineTestFixtures(['betty.level2']); // ice [0, 16, 0]
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(2);
    });

    it('Betty Level 3', function levelThree() {
      this.timeout(5000);
      defineTestFixtures(['opportunities', 'extended.opportunities', 'betty.level3']); // [5, 26, 5]
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(3);
    });

    it('Betty Level 4', function levelFour() {
      this.timeout(5000);
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level4']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(4);  // CAM: This will have to change with issue-302
    });

    it('Betty Level 5', function levelFive(done) {
      this.timeout(15000);
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level5']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(5);  // CAM: This will have to change with issue-302
      done();
    });

    it('Betty Level 6', function levelSix(done) {
      this.timeout(15000);
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level6']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(6);  // CAM: This will have to change with issue-302
      done();
    });

    it('Criteria Strings', function criteriaString(done) {
      this.timeout(15000);
      console.log(getLevelCriteriaStringMarkdown('six'));
      console.log(getLevelCriteriaStringMarkdown('five'));
      console.log(getLevelCriteriaStringMarkdown('four'));
      console.log(getLevelCriteriaStringMarkdown('three'));
      console.log(getLevelCriteriaStringMarkdown('two'));
      done();
    });
  });
}
