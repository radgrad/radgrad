/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '/imports/api/feedback/FeedbackInstanceCollection';
import { DesiredDegrees } from '/imports/api/degree-plan/DesiredDegreeCollection';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { defineTestFixture } from '/imports/api/test/test-fixture';
// import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
// import { makeSampleCourse, makeSampleCourseInstance } from '/imports/api/course/SampleCourses';
import { Users } from '/imports/api/user/UserCollection';

if (Meteor.isServer) {
  describe('FeedbackFunctions', function testSuite() {
    this.timeout(20000);
    let studentID;

    before(function setup() {
      removeAllEntities();
      defineTestFixture();
      studentID = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#checkCompletePlan', function test() {
      // const student = Users.findDoc(studentID);
      const degree = DesiredDegrees.findDoc({ shortName: 'B.S. CS' });
      Users.setDesiredDegree(studentID, degree._id);
      FeedbackFunctions.checkCompletePlan(studentID);
      const fi = FeedbackInstances.find({ userID: studentID }).fetch();
      expect(fi.length).to.equal(1);
    });
  });
}
