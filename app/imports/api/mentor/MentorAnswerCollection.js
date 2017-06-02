import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';


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
   * Defines an answer for a mentor question.
   * @example
   * MentorAnswers.define({ question: 'interview-tips',
   *                  mentor: 'akagawa',
   *                  text: 'Do lots of algorithm reviews' });
   * @param { Object } description Object with keys question, mentor, and text.
   * Mentor must be a valid user slug with role mentor.
   * Question must be a valid question.
   * @throws {Meteor.Error} If the definition includes an undefined mentor or undefined question.
   * @returns The newly created docID.
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
