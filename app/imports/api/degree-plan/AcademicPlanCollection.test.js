import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { Semesters } from '../semester/SemesterCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicPlanCollection', function testSuite() {
    const name = 'Bachelors in Computer Science';
    const shortName = 'B.S. CS';
    const degreeSlug = 'bs-cs';
    const description = 'B.S. in CS.';
    const semester = 'Spring-2017';
    const slug = 'bs-cs-2017';
    const notDefinedSemester = 'Spring-1991';
    const coursesPerSemester = [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0];
    const courseList = [
      'ics_111-1',
      'ics_141-1',
      'ics_211-1',
      'ics_241-1',
      'ics_311-1',
      'ics_314-1',
      'ics_212-1',
      'ics_321-1',
      'ics_312,ics_331-1',
      'ics_313,ics_361-1',
      'ics_332-1',
      'ics_400+-1',
      'ics_400+-2',
      'ics_400+-3',
      'ics_400+-4',
      'ics_400+-5',
    ];
    const badCourseList = [
      'ics_111-1',
      'ics_141-1',
      'ics_211-1',
      'ics_241-1',
      'ics_311-1',
      'ics_314-1',
      'ics_212-1',
      'ics_321-1',
      'ics_312,ics_331-1',
      'ics_313,ics_361-1',
      'ics_332-1',
      'ics_400+-1',
      'ics_400+-2',
      'ics_400+-3',
      'ics_400+-4',
    ];

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #findIdBySlug, #removeIt, #dumpOne, #restoreOne #checkIntegrity', function test() {
      Semesters.define({ term: 'Spring', year: 2017 });
      DesiredDegrees.define({ name, shortName, slug: degreeSlug, description });
      const docID = AcademicPlans.define({
        slug, degreeSlug, name: description, description, semester, coursesPerSemester, courseList,
      });
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      expect(AcademicPlans.findIdBySlug(slug)).to.be.a('string');
      const dumpObject = AcademicPlans.dumpOne(docID);
      AcademicPlans.removeIt(docID);
      expect(AcademicPlans.isDefined(docID)).to.be.false;
      const planID = AcademicPlans.restoreOne(dumpObject);
      expect(AcademicPlans.isDefined(planID)).to.be.true;
      AcademicPlans.removeIt(planID);
      expect(AcademicPlans.isDefined(planID)).to.be.false;
      const anotherID = AcademicPlans.define({
        slug, degreeSlug, name: description, description, semester: notDefinedSemester, coursesPerSemester, courseList,
      });
      expect(AcademicPlans.isDefined(anotherID)).to.be.true;
      const redefinedID = AcademicPlans.define({
        slug, degreeSlug, name: description, description, semester: notDefinedSemester, coursesPerSemester, courseList,
      });
      expect(AcademicPlans.isDefined(redefinedID)).to.be.true;
      expect(anotherID).to.be.equal(redefinedID);
      let errors = AcademicPlans.checkIntegrity();
      expect(errors.length).to.equal(0);
      AcademicPlans.removeIt(anotherID);
      const badID = AcademicPlans.define({
        slug, degreeSlug, name: description, description, semester: notDefinedSemester, coursesPerSemester,
        courseList: badCourseList,
      });
      expect(AcademicPlans.isDefined(badID)).to.be.true;
      errors = AcademicPlans.checkIntegrity();
      expect(errors.length).to.equal(1);
      AcademicPlans.removeIt(badID);
    });
  });
}
