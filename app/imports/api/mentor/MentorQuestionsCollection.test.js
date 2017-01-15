import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorQuestions} from './MentorQuestionsCollection';

if (Meteor.isServer) {
  describe('MentorQuestionsCollection', function testSuite() {
    // Define course data.
    let title = 'Test question.';
    let slug = 'test-question' ;

    before(function setup() {
      removeAllEntities();

    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      let instanceID = MentorQuestions.define({ title, slug, approved: true });
      expect(MentorQuestions.isDefined(instanceID)).to.be.true;
      MentorQuestions.removeIt(instanceID);
      expect(MentorQuestions.isDefined(instanceID)).to.be.false;
    });
  });
}
