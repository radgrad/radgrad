import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FeedbackFunctions } from '../feedback/FeedbackFunctions';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleUser } from '../user/SampleUsers';
import { defineTestFixtures } from '../test/test-utilities';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedbackFunctions', function testSuite() {
    let studentID;

    before(function setup() {
      this.timeout(0);
      defineTestFixtures(['minimal', 'extended.courses.interests', 'academicplan']);
      studentID = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it.skip('#checkCompletePlan', function test() {
      // const student = Users.findDoc(studentID);
      const degree = DesiredDegrees.findDoc({ shortName: 'B.S. CS' });
      Users.setDesiredDegree(studentID, degree._id);
      // TODO checkCompletePlan is asynchronous now. Need to add callback?
      FeedbackFunctions.checkCompletePlan(studentID);
      const fi = FeedbackInstances.find({ userID: studentID }).fetch();
      expect(fi.length).to.equal(1);
    });
  });
}
