import { Meteor } from 'meteor/meteor';
import { DesiredDegrees } from '/imports/api/degree-plan/DesiredDegreeCollection';
import { AcademicPlans } from '/imports/api/degree-plan/AcademicPlanCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicPlanCollection', function testSuite() {
    const name = 'Bachelors in Computer Science';
    const shortName = 'B.S. CS';
    const slug = 'bs-cs';
    const description = 'B.S. in CS.';
    const semester = 'Spring-2017';
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

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      Semesters.define({ term: 'Spring', year: 2017 });
      DesiredDegrees.define({ name, shortName, slug, description });
      const docID = AcademicPlans.define({
        degreeSlug: slug, name: description, semester, coursesPerSemester, courseList,
      });
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      const dumpObject = AcademicPlans.dumpOne(docID);
      AcademicPlans.removeIt(docID);
      expect(AcademicPlans.isDefined(docID)).to.be.false;
      const planID = AcademicPlans.restoreOne(dumpObject);
      expect(AcademicPlans.isDefined(planID)).to.be.true;
    });
  });
}
