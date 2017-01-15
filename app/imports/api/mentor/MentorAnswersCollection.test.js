import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorAnswers } from './MentorAnswersCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorAnswersCollection', function testSuite() {
    // Define course data.
    const question = 'hiring-expectations';
    const mentorID = 'nagashima';
    const text = 'Test answer.';

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = MentorAnswers.define({ question, mentorID, text });
      expect(MentorAnswers.isDefined(instanceID)).to.be.true;
      MentorAnswers.removeIt(instanceID);
      expect(MentorAnswers.isDefined(instanceID)).to.be.false;
    });
  });
}
