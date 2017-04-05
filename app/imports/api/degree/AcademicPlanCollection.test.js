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
    const coursesPerSemester = [2, 2, 2, 2, 2, 2, 2, 2];
    const courseList = [{ slug: 'ics111' }, { slug: 'ics141' }, { slug: 'ics211' }, { slug: 'ics241' },
      { slug: 'ics311' }, { slug: 'ics314' }, { slug: 'ics212' }, { slug: 'ics321' },
      ['ics313', 'ics361'], ['ics312', 'ics331'], { slug: 'ics332' }, { slug: 'ics4xx' },
      { slug: 'ics4xx' }, { slug: 'ics4xx' }, { slug: 'ics4xx' }, { slug: 'ics4xx' }];

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
        degreeSlug: slug, semester, coursesPerSemester, courseList,
      });
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      const dumpObject = AcademicPlans.dumpOne(docID);
      AcademicPlans.removeIt(docID);
      expect(AcademicPlans.isDefined(docID)).to.be.false;
      AcademicPlans.restoreOne(dumpObject);
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      AcademicPlans.removeIt(docID);
    });
  });
}