/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { defineTestFixture } from '/imports/api/test/test-fixture';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { expect } from 'chai';
import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { DesiredDegrees } from '../../api/degree/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
// import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection.js';
// import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection.js';
// import { MentorProfiles } from '../../api/mentor/MentorProfileCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
// import { Reviews } from '../../api/review/ReviewCollection';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';
import { generateBSDegreePlan } from './plan-generator';

if (Meteor.isServer) {
  describe('plan-generator', function testSuite() {
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

    it('#newStudent', function test() {
      const student = Users.findDoc(studentID);
      generateBSDegreePlan(student, Semesters.getCurrentSemesterDoc());
      const courseInstances = CourseInstances.find({ studentID: student._id }).fetch();
      expect(courseInstances.length > 0).to.be.true;
      // let courseInstanceID = CourseInstances.define({ semester, course, verified, grade, student });
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.true;
      // const dumpObject = CourseInstances.dumpOne(courseInstanceID);
      // CourseInstances.removeIt(courseInstanceID);
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.false;
      // courseInstanceID = CourseInstances.restoreOne(dumpObject);
      // expect(CourseInstances.isDefined(courseInstanceID)).to.be.true;
      // CourseInstances.removeIt(courseInstanceID);
    });
  });
}
