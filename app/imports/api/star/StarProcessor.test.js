import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineTestFixtures } from '../test/test-utilities';
import { processStarCsvData } from './StarProcessor';
import { Users } from '../user/UserCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

if (Meteor.isServer) {
  describe('StarProcessor', function testSuite() {
    this.timeout(5000);
    const starDataPath = 'testdata/StarSampleData-1.csv';
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#processStarCsvData', function test() {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student']);
      const csvData = Assets.getText(starDataPath);
      const profile = Users.getProfile('abi@hawaii.edu');
      const courseInstanceDefinitions = processStarCsvData(profile.username, csvData);
      expect(courseInstanceDefinitions.length).to.equal(11);
    });

    it.skip('check real data', function test() {
      const realDataFiles = [
        'realdata/star-data-1.csv',
        'realdata/star-data-2.csv',
        'realdata/star-data-3.csv',
        'realdata/star-data-4.csv',
        'realdata/star-data-5.csv',
        'realdata/star-data-6.csv'];
      realDataFiles.map(function parseDataFile(dataFile) {
        const csvData = Assets.getText(dataFile);
        const user = Users.getProfile(makeSampleUser()).username;
        const courseInstanceDefinitions = processStarCsvData(user, csvData);
        courseInstanceDefinitions.map((definition) => CourseInstances.define(definition));
        return true;
      });
    });
  });
}
