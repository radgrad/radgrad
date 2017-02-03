/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */
/* global Assets */

import { Meteor } from 'meteor/meteor';
import { processStarCsvData } from '/imports/api/star/StarProcessor';
import { Users } from '/imports/api/user/UserCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { loadDefinitions } from '/imports/startup/server/icsdata/LoadDefinitions';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { ROLE } from '/imports/api/role/Role';
import { getTotalICE } from '/imports/api/ice/IceProcessor';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
import { _ } from 'meteor/erasaur:meteor-lodash';

if (Meteor.isServer) {
  describe('LevelProcessor Tests', function testSuite() {
    // STAR data is in private/ directory.
    const starDataPath = 'testdata/StarPersonaAlfred.csv';
    const starDataSize = 15;
    let studentSlug;
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
      const level =
    });
  });
}
