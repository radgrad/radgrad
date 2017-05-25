/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off' */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
// import { processStarCsvData } from '../star/StarProcessor';
import { Users } from '../user/UserCollection';
import { calcLevel } from './LevelProcessor';
// import { CourseInstances } from '../course/CourseInstanceCollection';
// import { Courses } from '../course/CourseCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { ROLE } from '../role/Role';
import { expect } from 'chai';
// import { _ } from 'meteor/erasaur:meteor-lodash';
// import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
// import { Interests } from '../interest/InterestCollection';
// import { FeedbackFunctions } from '../feedback/FeedbackFunctions';

// TODO: Waiting for test data based upon the Personae.

if (Meteor.isServer) {
  describe('LevelProcessor Tests', function testSuite() {
    let studentID;

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Level 1 Student', function test() {
      studentID = Users.define({
        firstName: 'Level',
        lastName: 'One',
        slug: 'levelone',
        email: 'levelone@hawaii.edu',
        role: ROLE.STUDENT,
        password: 'foo',
      });
      const level = calcLevel(studentID);
      expect(level).to.equal(1);
    });
  });
}
