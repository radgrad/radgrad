import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { defineTestFixtures } from '../test/test-utilities';
import { processStarCsvData, processStarJsonData, processBulkStarJsonData } from './StarProcessor';
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
    const starDataPath = 'database/star/StarSampleData-1.csv';
    const starJsonDataPath = 'database/star/BulkStarSampleData-1.json';
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
      removeAllEntities();
    });

    it('#processStarJsonData', function testJson() {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student']);
      const jsonData = JSON.parse(Assets.getText(starJsonDataPath));
      const profile = Users.getProfile('abi@hawaii.edu');
      const courseInstanceDefinitions = processStarJsonData(profile.username, jsonData[0]);
      expect(courseInstanceDefinitions.length).to.equal(12);
      removeAllEntities();
    });

    it('#processBulkStarJsonData', function testJson() {
      defineTestFixtures(['minimal', 'extended.courses.interests']);
      const jsonData = JSON.parse(Assets.getText(starJsonDataPath));
      const studentData = processBulkStarJsonData(jsonData);
      expect(_.keys(studentData).length).to.equal(1);
      expect(_.keys(studentData)[0]).to.equal('abi@hawaii.edu');
      removeAllEntities();
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
