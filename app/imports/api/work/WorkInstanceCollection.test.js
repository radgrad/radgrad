import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import { WorkInstances } from '/imports/api/work/WorkInstanceCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('WorkInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #toString', function test() {
      const semesterID = Semesters.define({ term: Semesters.FALL, year: 2015 });
      expect(Semesters.isDefined(semesterID)).to.be.true;
      const semester = Semesters.findSlugByID(semesterID);
      const student = Users.findSlugByID(makeSampleUser());
      const docID = WorkInstances.define({ semester, hrsWk: 20, student });
      expect(WorkInstances.isDefined(docID)).to.be.true;
      WorkInstances.toString(docID);
      WorkInstances.removeIt(docID);
      expect(WorkInstances.isDefined(docID)).to.be.false;
    });
  });
}

