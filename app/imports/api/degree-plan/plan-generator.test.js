/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { defineTestFixture } from '/imports/api/test/test-fixture';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { expect } from 'chai';
import { AcademicPlans } from './AcademicPlanCollection';
import { CourseInstances } from '../course/CourseInstanceCollection.js';
import { Users } from '../user/UserCollection';
import { Semesters } from '../semester/SemesterCollection.js';
import { generateAcademicPlan } from './plan-generator';
// import { processStudentStarCsvData } from '../star/StarMethods';

if (Meteor.isServer) {
  describe('plan-generator', function testSuite() {
    this.timeout(0);
    let studentID;
    // const sophmoreStudentCleanData = 'testdata/sophmoreClean.csv';
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

    it('B.S. CS 2016', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2016, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.S. in Computer Sciences',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.S. CS SS 2016', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2016, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.S. in Computer Sciences Security Sciences',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.A. ICS 2016', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2016, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A in Information and Computer Sciences',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(12);
    });
    it('B.A. ICS SSF 2016', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2016, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A. in ICS Security Science Focus',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.A. ICS IT 2016', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2016, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A. in ICS IT Focus',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(19);
    });
    it('B.S. CS 2017', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.S. in Computer Sciences',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.S. CS SS 2017', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.S. in Computer Science Security Science',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.A. ICS 2017', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A. in Information and Computer Sciences',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(12);
    });
    it('B.A. ICS SSF 2017', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A. in ICS Security Science Focus',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(16);
    });
    it('B.A. ICS IT 2017', function test() {
      const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
      const plan = AcademicPlans.findDoc({
        name: 'B.A. in Computer Sciences IT Focus',
        effectiveSemesterID,
      });
      const student = Users.findDoc(studentID);
      student.academicPlanID = plan._id;
      generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length).to.equal(19);
    });
    // it('B.S. CE 2017', function test() {
    //   const effectiveSemesterID = Semesters.define({ year: 2017, term: 'Fall' });
    //   const plan = AcademicPlans.findDoc({
    //     name: 'B.S. in Computer Engineering',
    //     effectiveSemesterID,
    //   });
    //   const student = Users.findDoc(studentID);
    //   student.academicPlanID = plan._id;
    //   generateAcademicPlan(student, Semesters.getCurrentSemesterDoc());
    //   const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
    //   expect(courseInstances.length).to.equal(19);
    // });
  });
}
