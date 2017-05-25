/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FeedbackFunctions } from '../feedback/FeedbackFunctions';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleUser } from '../user/SampleUsers';
import { defineTestFixture } from '../test/test-fixture';
// import { makeSampleInterest } from '../interest/SampleInterests';
// import { makeSampleCourse, makeSampleCourseInstance } from '../course/SampleCourses';
import { Users } from '../user/UserCollection';

if (Meteor.isServer) {
  describe('FeedbackFunctions', function testSuite() {
    this.timeout(0);
    let studentID;

    before(function setup() {
      removeAllEntities();
      defineTestFixture('FeedbackFunctions.json');
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
