import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorAnswers } from './MentorAnswersCollection';

if (Meteor.isServer) {
  describe('MentorAnswersCollection', function testSuite() {
    // Define course data.
    let question = 'hiring-expectations';
    let mentorID = 'nagashima' ;
    let text = 'Test answer.' ;

    before(function setup() {
      removeAllEntities();

    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      let instanceID = MentorAnswers.define({ question, mentorID, text });
      expect(MentorAnswers.isDefined(instanceID)).to.be.true;
      MentorAnswers.removeIt(instanceID);
      expect(MentorAnswers.isDefined(instanceID)).to.be.false;

    });
  });
}
