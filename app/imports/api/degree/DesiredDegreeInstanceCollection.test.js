import { Meteor } from 'meteor/meteor';
// import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
// import { DesiredDegreeInstances } from '/imports/api/degree/DesiredDegreeInstanceCollection';
// import { Semesters } from '/imports/api/semester/SemesterCollection';
// import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DesiredDegreeInstanceCollection', function testSuite() {
    // const name = 'Bachelors in Computer Science';
    // const shortName = 'B.S. CS';
    // const slug = 'bs-cs';
    // const description = 'B.S. in CS.';
    // const semester = 'Spring-2017';
    // const coursesPerSemester = [2, 2, 2, 2, 2, 2, 2, 2];
    // const courseList = ['ics111', 'ics141', 'ics211', 'ics241', 'ics311', 'ics314', 'ics212', 'ics321',
    //   ['ics313', 'ics361'], ['ics312', 'ics331'], 'ics332', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx'];

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    // it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
    //   Semesters.define({ term: 'Spring', year: 2017 });
    //   DesiredDegrees.define({ name, shortName, slug, description });
    //   const docID = DesiredDegreeInstances.define({
    //     degreeSlug: slug, semester, coursesPerSemester, courseList,
    //   });
    //   console.log(docID);
    //   expect(DesiredDegreeInstances.isDefined(docID)).to.be.true;
    //   const dumpObject = DesiredDegreeInstances.dumpOne(docID);
    //   DesiredDegreeInstances.removeIt(docID);
    //   expect(DesiredDegreeInstances.isDefined(docID)).to.be.false;
    //   DesiredDegreeInstances.restoreOne(dumpObject);
    //   expect(DesiredDegreeInstances.isDefined(docID)).to.be.true;
    //   DesiredDegreeInstances.removeIt(docID);
    // });
  });
}
