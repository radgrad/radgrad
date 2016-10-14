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
  describe('Exercise Alfred (a sophomore ICS student persona)', function testSuite() {
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

    it('Load RadGrad entities', function test() {
      this.timeout(10000);
      loadDefinitions();
    });

    it('Define Alfred, load STAR data', function test() {
      studentID = Users.define({
        firstName: 'Alfred',
        lastName: 'Persona',
        slug: 'alfredpersona',
        email: 'alfred@hawaii.edu',
        role: ROLE.STUDENT,
        password: 'foo' });
      studentSlug = Users.findSlugByID(studentID);
      const csvData = Assets.getText(starDataPath);
      const courseInstanceDefinitions = processStarCsvData(studentSlug, csvData);
      courseInstanceDefinitions.map((definition) => CourseInstances.define(definition));
      expect(CourseInstances.count()).to.equal(starDataSize);
    });

    it('Check course ICE total', function test() {
      const courseInstances = CourseInstances.find({ studentID }).fetch();
      expect(courseInstances.length).to.equal(starDataSize);
      const totalICE = getTotalICE(courseInstances);
      expect(totalICE.i).to.equal(0);
      expect(totalICE.c).to.equal(14);
      expect(totalICE.e).to.equal(0);
    });

    it('Add opportunity, check ICE', function test() {
      const oppID = OpportunityInstances.define({
        semester: 'Fall-2015',
        opportunity: 'open-power-quality',
        verified: true,
        student: studentSlug });
      const oppDoc = OpportunityInstances.findDoc(oppID);
      const totalICE = getTotalICE([oppDoc]);
      expect(totalICE.i).to.equal(25);
      expect(totalICE.c).to.equal(0);
      expect(totalICE.e).to.equal(25);
    });

    it('Users#getTotalICE', function test() {
      const totalICE = Users.getTotalICE(studentID);
      expect(totalICE.i).to.equal(25);
      expect(totalICE.c).to.equal(14);
      expect(totalICE.e).to.equal(25);
    });

    it('Add interest, check RecommendedCoursesBasedOnInterest', function test() {
      const seID = Interests.findIdBySlug('software-engineering');
      const appdevID = Interests.findIdBySlug('application-development');
      Users.setInterestIds(studentID, [seID, appdevID]);
      /* eslint dot-notation: "off" */
      _.forEach(Users.findDoc(studentID).interestIDs, function recommendInterest(interestID) {
        const recommendation = FeedbackFunctions['recommendedCoursesBasedOnInterest'](studentID, interestID);
        // console.log(recommendation);
        expect(recommendation).to.contain('ICS');
      });
    });
  });
}
