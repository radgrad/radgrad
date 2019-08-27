import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FavoriteAcademicPlans } from './FavoriteAcademicPlanCollection';
import { makeSampleAcademicPlan, sampleAcademicPlanName } from '../degree-plan/SampleAcademicPlans';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteAcademicPlanCollection', function testSuite() {
    let academicPlan;
    let student;

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      academicPlan = makeSampleAcademicPlan();
      student = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #update, #checkIntegrity', function test() {
      let docID = FavoriteAcademicPlans.define({ academicPlan, student });
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.true;
      let problems = FavoriteAcademicPlans.checkIntegrity();
      expect(problems.length).to.equal(0);
      const dumpObject = FavoriteAcademicPlans.dumpOne(docID);
      FavoriteAcademicPlans.removeIt(docID);
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.false;
      docID = FavoriteAcademicPlans.restoreOne(dumpObject);
      problems = FavoriteAcademicPlans.checkIntegrity();
      expect(problems.length).to.equal(0);
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.true;
      expect(FavoriteAcademicPlans.countNonRetired()).to.equal(1);
      FavoriteAcademicPlans.update(docID, { retired: true });
      expect(FavoriteAcademicPlans.countNonRetired()).to.equal(0);
      FavoriteAcademicPlans.removeIt(docID);
    });

    it('#getAcademicPlanDoc, #getAcademicPlanSlug, #getStudentDoc, #getStudentUsername', function test() {
      const docID = FavoriteAcademicPlans.define({ academicPlan, student });
      const academicPlanDoc = FavoriteAcademicPlans.getAcademicPlanDoc(docID);
      expect(academicPlanDoc).to.exist;
      expect(academicPlanDoc.name).to.equal(sampleAcademicPlanName);
      const academicPlanSlug = Slugs.getNameFromID(academicPlanDoc.slugID);
      expect(FavoriteAcademicPlans.getAcademicPlanSlug(docID)).to.equal(academicPlanSlug);
      const studentDoc = FavoriteAcademicPlans.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal('Amy');
      const studentUsername = FavoriteAcademicPlans.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername.endsWith('@hawaii.edu')).to.be.true;
    });
  });
}
