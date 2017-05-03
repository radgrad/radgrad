/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { defineTestFixture } from '/imports/api/test/test-fixture';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { expect } from 'chai';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Users } from '../../api/user/UserCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { generateBSDegreePlan } from './plan-generator';
import { processStudentStarCsvData } from '../star/StarMethods';

if (Meteor.isServer) {
  describe('plan-generator', function testSuite() {
    this.timeout(20000);
    let studentID;
    const sophmoreStudentCleanData = 'testdata/sophmoreClean.csv';
    // const sophmoreStudentMissingOneData = 'testdata/sophmoreMissingOne.csv';
    before(function setup() {
      // console.log('setup');
      removeAllEntities();
      defineTestFixture();
      studentID = makeSampleUser();
    });

    beforeEach(function clean() {
      CourseInstances.removeAll();
    });

    after(function teardown() {
      // console.log('teardown');
      removeAllEntities();
    });

    it('#newStudent', function test() {
      // console.log('newStudent');
      const student = Users.findDoc(studentID);
      generateBSDegreePlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
      // let courseInstanceID = CourseInstances.define({ semester, course, verified, grade, student });
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.true;
      // const dumpObject = CourseInstances.dumpOne(courseInstanceID);
      // CourseInstances.removeIt(courseInstanceID);
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.false;
      // courseInstanceID = CourseInstances.restoreOne(dumpObject);
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.true;
      // CourseInstances.removeIt(courseInstanceID);
    });
    it('#sophmoreStudent', function test() {
      // console.log('sophmore');
      const student = Users.findDoc(studentID);
      const csvData = Assets.getText(sophmoreStudentCleanData);
      const user = Users.findSlugByID(studentID);
      processStudentStarCsvData(user, csvData);
      generateBSDegreePlan(student, Semesters.getCurrentSemesterDoc());
      const icsCourses = CourseInstances.find({ studentID, note: /ICS/ }).fetch();
      expect(icsCourses.length).to.equal(16);
    });
  });
}
