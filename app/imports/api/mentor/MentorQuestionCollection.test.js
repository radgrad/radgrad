import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '../user/SampleUsers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorQuestionCollection', function testSuite() {
    let question;
    let slug;
    let student;

    before(function setup() {
      removeAllEntities();
      question = 'Test question.';
      slug = 'test-mentor-question';
      student = makeSampleUser();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = MentorQuestions.define({ question, slug, student });
      expect(MentorQuestions.isDefined(docID)).to.be.true;
      let dumpObject = MentorQuestions.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(MentorQuestions.findNonRetired().length).to.equal(1);
      MentorQuestions.update(docID, { retired: true });
      expect(MentorQuestions.findNonRetired().length).to.equal(0);
      MentorQuestions.removeIt(docID);
      expect(MentorQuestions.isDefined(docID)).to.be.false;
      docID = MentorQuestions.define(dumpObject);
      expect(MentorQuestions.isDefined(docID)).to.be.true;
      MentorQuestions.update(docID, { retired: true });
      dumpObject = MentorQuestions.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
    });
  });
}
