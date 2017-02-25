/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

// import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
import { Meteor } from 'meteor/meteor';
// import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
// import { makeCourseRecommendationFeedback } from '/imports/api/feedback/SampleFeedbacks';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { makeSampleCourse, makeSampleCourseInstance } from '/imports/api/course/SampleCourses';
import { Users } from '/imports/api/user/UserCollection';

if (Meteor.isServer) {
  describe('FeedbackFunctions', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('recommendedCoursesBasedOnStudentInterest', function test() {
      // Make a user with an interest.
      const userID = makeSampleUser();
      const interestID = makeSampleInterest();
      // const feedbackID = makeCourseRecommendationFeedback();
      Users.setInterestIds(userID, [interestID]);
      // Make a course ICS 100.
      const number = 'ICS 100';
      const courseID = makeSampleCourse({ interestID, number });
      // Now make a course ICS 101.
      const number2 = 'ICS 101';
      makeSampleCourse({ interestID, number: number2 });
      // The user only takes ICS 100.
      makeSampleCourseInstance(userID, { course: courseID });
      // Now check to see that ICS 101 is recommended.
      /* eslint dot-notation: "off" */
 //     const recommendation = FeedbackFunctions['generateRecommendedCourse'](userID);
 //     expect(recommendation).to.contain(number2);
    });
  });
}
