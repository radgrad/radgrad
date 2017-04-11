import { Meteor } from 'meteor/meteor';
import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
import { AcademicPlans } from '/imports/api/degree/AcademicPlanCollection';
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
    const courseList = [{ course: ['ics111'] }, { course: ['ics141'] }, { course: ['ics211'] }, { course: ['ics241'] },
      { course: ['ics311'] }, { course: ['ics314'] }, { course: ['ics212'] }, { course: ['ics321'] },
      { course: ['ics313', 'ics361'] }, { course: ['ics312', 'ics331'] }, { course: ['ics332'] },
      { course: ['ics4xx'] }, { course: ['ics4xx'] }, { course: ['ics4xx'] },
      { course: ['ics4xx'] }, { course: ['ics4xx'] }];

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
