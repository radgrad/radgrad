import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FavoriteCourses } from './FavoriteCourseCollection';
import { makeSampleCourse, sampleCourseName } from '../course/SampleCourses';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteCourseCollection', function testSuite() {
    let course;
    let student;

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      course = makeSampleCourse();
      student = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #update, #checkIntegrity', function test() {
      let docID = FavoriteCourses.define({ course, student });
      expect(FavoriteCourses.isDefined(docID)).to.be.true;
      let problems = FavoriteCourses.checkIntegrity();
      expect(problems.length).to.equal(0);
      const dumpObject = FavoriteCourses.dumpOne(docID);
      FavoriteCourses.removeIt(docID);
      expect(FavoriteCourses.isDefined(docID)).to.be.false;
      docID = FavoriteCourses.restoreOne(dumpObject);
      problems = FavoriteCourses.checkIntegrity();
      expect(problems.length).to.equal(0);
      expect(FavoriteCourses.isDefined(docID)).to.be.true;
      expect(FavoriteCourses.countNonRetired()).to.equal(1);
      FavoriteCourses.update(docID, { retired: true });
      expect(FavoriteCourses.countNonRetired()).to.equal(0);
      FavoriteCourses.removeIt(docID);
    });

    it('#getCourseDoc, #getCourseSlug, #getStudentDoc, #getStudentUsername', function test() {
      const docID = FavoriteCourses.define({ course, student });
      const courseDoc = FavoriteCourses.getCourseDoc(docID);
      expect(courseDoc).to.exist;
      expect(courseDoc.name).to.equal(sampleCourseName);
      const courseSlug = Slugs.getNameFromID(courseDoc.slugID);
      expect(FavoriteCourses.getCourseSlug(docID)).to.equal(courseSlug);
      const studentDoc = FavoriteCourses.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal('Amy');
      const studentUsername = FavoriteCourses.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername.endsWith('@hawaii.edu')).to.be.true;
    });
  });
}
