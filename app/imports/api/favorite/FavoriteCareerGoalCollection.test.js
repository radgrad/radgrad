import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FavoriteCareerGoals } from './FavoriteCareerGoalCollection';
import { makeSampleCareerGoal, sampleCareerGoalName } from '../career/SampleCareerGoals';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteCareerGoalCollection', function testSuite() {
    let course;
    let student;

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      course = makeSampleCareerGoal();
      student = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #update, #checkIntegrity', function test() {
      let docID = FavoriteCareerGoals.define({ course, student });
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.true;
      let problems = FavoriteCareerGoals.checkIntegrity();
      expect(problems.length).to.equal(0);
      const dumpObject = FavoriteCareerGoals.dumpOne(docID);
      FavoriteCareerGoals.removeIt(docID);
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.false;
      docID = FavoriteCareerGoals.restoreOne(dumpObject);
      problems = FavoriteCareerGoals.checkIntegrity();
      expect(problems.length).to.equal(0);
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.true;
      expect(FavoriteCareerGoals.countNonRetired()).to.equal(1);
      FavoriteCareerGoals.update(docID, { retired: true });
      expect(FavoriteCareerGoals.countNonRetired()).to.equal(0);
      FavoriteCareerGoals.removeIt(docID);
    });

    it('#getCareerGoalDoc, #getCareerGoalSlug, #getStudentDoc, #getStudentUsername', function test() {
      const docID = FavoriteCareerGoals.define({ course, student });
      const courseDoc = FavoriteCareerGoals.getCareerGoalDoc(docID);
      expect(courseDoc).to.exist;
      expect(courseDoc.name).to.equal(sampleCareerGoalName);
      const courseSlug = Slugs.getNameFromID(courseDoc.slugID);
      expect(FavoriteCareerGoals.getCareerGoalSlug(docID)).to.equal(courseSlug);
      const studentDoc = FavoriteCareerGoals.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal('Amy');
      const studentUsername = FavoriteCareerGoals.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername.endsWith('@hawaii.edu')).to.be.true;
    });
  });
}
