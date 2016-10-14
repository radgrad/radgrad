import { Interests } from '/imports/api/interest/InterestCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Users } from '/imports/api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module FeedbackFunctions */

/**
 * A class containing Feedback functions.
 * When defining a Feedback instance, the slug string must also be the name of a feedback function defined
 * as a static method within this class.
 * So, for example, given a Feedback whose slug is 'SampleFeedback', you can invoke its Feedback function as follows:
 * @example
 * import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
 * :
 * :
 * FeedbackFunctions['SampleFeedback']();
 * @class FeedbackFunctions
 * @static
 */
export class FeedbackFunctions {

  /**
   * The FeedbackFunction used for testing purposes.
   * @returns { String } A sample feedback string.
   * @static
   */
  static sampleFeedback() {
    return 'Sample Feedback';
  }

  /**
   * Returns a string indicating courses recommended based on a specific interest.
   * Filters out courses the user has already taken (or plans to take).
   * Returns the empty string if there are no courses recommended for this interest.
   * @param userID The userID.
   * @param interestID An interestID associated with userID.
   * @returns { String } The recommendation string.
   * @static
   */
  static recommendedCoursesBasedOnInterest(userID, interestID) {
    let courseNumbers = '';
    const interestName = Interests.findDoc(interestID).name;
    const courseDocsWithInterest = Courses.find({ interestIDs: interestID }).fetch();
    const courseIDsWithInterest = courseDocsWithInterest.map((doc) => doc._id);
    const userCourseIDs = Users.getCourseIDs(userID);
    const interestingCourseIDs = _.difference(courseIDsWithInterest, userCourseIDs);

    interestingCourseIDs.forEach((courseID) => { courseNumbers += `${Courses.findDoc(courseID).number} `; });

    return (interestingCourseIDs.length === 0) ? '' :
        `Recommended courses based on your interest in ${interestName}: ${courseNumbers}`;
  }

  /**
   * Returns a string indicating opportunities available this semester based on a specific interest.
   * Filters out courses the user has already taken (or plans to take).
   * Returns the empty string if there are no courses recommended for this interest.
   * @param userID The userID.
   * @param interestID An interestID associated with userID.
   * @returns { String } The recommendation string.
   * @static
   */
  static recommendedOpportunitiesBasedOnInterest(userID, interestID) {
    return { userID, interestID };
  }
}
