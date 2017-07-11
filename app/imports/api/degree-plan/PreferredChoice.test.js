import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixtures } from '../test/test-utilities';
import PreferredChoice from './PreferredChoice';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PreferredChoice', function testSuite() {
    before(function setup() {
      this.timeout(5000);
      defineTestFixtures(['minimal', 'extended.courses.interests']);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#hasPreferences, #getBestChoices', function test() {
      const courses = [];
      courses.push(Courses.findDocBySlug('ics_111'));
      courses.push(Courses.findDocBySlug('ics_141'));
      courses.push(Courses.findDocBySlug('ics_211'));
      const interestIDs = [];
      interestIDs.push(Interests.findIdBySlug('ruby'));
      let preferred = new PreferredChoice(courses, interestIDs);
      expect(preferred.hasPreferences()).to.be.false;
      expect(preferred.getBestChoices().length).to.equal(3);
      interestIDs.push(Interests.findIdBySlug('java'));
      preferred = new PreferredChoice(courses, interestIDs);
      expect(preferred.hasPreferences()).to.be.true;
      expect(preferred.getBestChoices().length).to.equal(2);
      interestIDs.push(Interests.findIdBySlug('algorithms'));
      preferred = new PreferredChoice(courses, interestIDs);
      expect(preferred.hasPreferences()).to.be.true;
      expect(preferred.getBestChoices().length).to.equal(1);
      interestIDs.push(Interests.findIdBySlug('software-engineering'));
      preferred = new PreferredChoice(courses, interestIDs);
      expect(preferred.hasPreferences()).to.be.true;
      expect(preferred.getBestChoices().length).to.equal(1);
    });
  });
}
