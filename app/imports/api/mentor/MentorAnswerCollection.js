import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Users } from '/imports/api/user/UserCollection';
import { MentorQuestions } from '/imports/api/mentor/MentorQuestionCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module api/mentor/MentorAnswerCollection */

/**
 * Represents a mentor answer.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class MentorAnswerCollection extends BaseCollection {
  /**
   * Creates the Mentor Answer collection.
   */
  constructor() {
    super('MentorAnswer', new SimpleSchema({
      questionID: { type: SimpleSchema.RegEx.Id },
      mentorID: { type: SimpleSchema.RegEx.Id },
      text: { type: String },
    }));
  }

  /**
   * Defines the help for a given questionID.
   * @param question The question (slug or ID).
   * @param mentor The mentor who answered the question (slug or ID).
   * @param text The answer itself.
   * @return { String } The docID of the answer.
   * @throws { Meteor.Error } If question or mentor is undefined.
   */
  define({ question, mentor, text }) {
    const questionID = MentorQuestions.getID(question);
    const mentorID = Users.getID(mentor); // TODO: Require that user is in role Mentor?
    return this._collection.insert({ questionID, mentorID, text });
  }

  /**
   * Returns the text for the given questionID.
   * @param question
   */
  getAnswers(question) {
    return this._collection.find({ questionID: question });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks questionID, mentorID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!MentorQuestions.isDefined(doc.questionID)) {
        problems.push(`Bad questionID: ${doc.questionID}`);
      }
      if (!Users.isDefined(doc.mentorID)) {
        problems.push(`Bad mentorID: ${doc.mentorID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the MentorAnswer docID in a format acceptable to define().
   * @param docID The docID of a MentorQuestion.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const question = MentorQuestions.findSlugByID(doc.questionID);
    const mentor = Users.findSlugByID(doc.mentorID);
    const text = doc.text;
    return { question, mentor, text };
  }
}

export const MentorAnswers = new MentorAnswerCollection();
radgradCollections.push(MentorAnswers);
