/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
import { defineTestFixture } from '../test/test-fixture';
import { processStarCsvData } from './StarProcessor';
import { Users } from '/imports/api/user/UserCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('StarProcessor', function testSuite() {
    this.timeout(0);
    const starDataPath = 'testdata/StarSampleData-1.csv';
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#processStarCsvData', function test() {
      defineTestFixture('CoursesInterests.json');
      const csvData = Assets.getText(starDataPath);
      const user = Users.findDoc({ username: 'abi' });
      const courseInstanceDefinitions = processStarCsvData(user.username, csvData);
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
        const user = Users.findSlugByID(makeSampleUser());
        const courseInstanceDefinitions = processStarCsvData(user, csvData);
        courseInstanceDefinitions.map((definition) => CourseInstances.define(definition));
        return true;
      });
    });
  });
}
