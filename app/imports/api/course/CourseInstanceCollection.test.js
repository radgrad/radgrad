/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Semesters } from '/imports/api/semester/SemesterCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { makeSampleCourse, sampleCourseName } from '/imports/api/course/SampleCourses';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('CourseInstanceCollection', function testSuite() {
    // Define course data.
    let course;
    let student;
    let semester;
    const verified = true;
    const grade = 'B';

    before(function setup() {
      removeAllEntities();
      course = makeSampleCourse();
      student = makeSampleUser();
      semester = Semesters.define({ term: Semesters.FALL, year: 2015 });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const courseInstanceID = CourseInstances.define({ semester, course, verified, grade, student });
      expect(CourseInstances.isDefined(courseInstanceID)).to.be.true;
      CourseInstances.removeIt(courseInstanceID);
      expect(CourseInstances.isDefined(courseInstanceID)).to.be.false;
    });

    it('#findCourseName, #toString', function test() {
      const courseInstanceID = CourseInstances.define({ semester, course, verified, grade, student });
      CourseInstances.toString(courseInstanceID);
      expect(CourseInstances.findCourseName(courseInstanceID)).to.equal(sampleCourseName);
      CourseInstances.removeIt(courseInstanceID);
    });
  });
}

