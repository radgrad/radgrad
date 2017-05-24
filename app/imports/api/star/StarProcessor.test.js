/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
import { defineTestFixture } from '../test/test-fixture';
import { processStarCsvData } from '../star/StarProcessor';
import { Users } from '../user/UserCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';

if (Meteor.isServer) {
  describe('StarProcessor', function testSuite() {
    const starDataPath = 'testdata/StarSampleData-2.csv';
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it.skip('#processStarCsvData', function test() {
      this.timeout(20000);
      defineTestFixture();
      const csvData = Assets.getText(starDataPath);
      const user = Users.findSlugByID(makeSampleUser());
      const courseInstanceDefinitions = processStarCsvData(user, csvData);
      // console.log(courseInstanceDefinitions);
      courseInstanceDefinitions.map((definition) => CourseInstances.define(definition));
      expect(CourseInstances.count()).to.equal(159);
    });

    it.skip('check real data', function test() {
      this.timeout(10000);
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
