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
    const planChoice = [
      { choices: [{ choice: ['ics111'] }] },
      { choices: [{ choice: ['ics141'] }] },
      { choices: [{ choice: ['ics211'] }] },
      { choices: [{ choice: ['ics241'] }] },
      { choices: [{ choice: ['ics311'] }] },
      { choices: [{ choice: ['ics314'] }] },
      { choices: [{ choice: ['ics212'] }] },
      { choices: [{ choice: ['ics321'] }] },
      { choices: [{ choice: ['ics313', 'ics361'] }] },
      { choices: [{ choice: ['ics312', 'ics331'] }] },
      { choices: [{ choice: ['ics332'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
      { choices: [{ choice: ['ics4xx'] }] },
    ];
    const courseList = [{ planChoice }];

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
