import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorAnswers } from './MentorAnswersCollection';

if (Meteor.isServer) {
  describe('MentorAnswersCollection', function testSuite() {
    // Define course data.
    const questionID = ;
    const mentor = ;
    const slug = ;
    const text = ;

    before(function setup() {
      removeAllEntities();

    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = Teasers.define({ title, slug, author, url, description, duration, interests });
      expect(Teasers.isDefined(instanceID)).to.be.true;
      Teasers.removeIt(instanceID);
      expect(Teasers.isDefined(instanceID)).to.be.false;
    });
  });
}
