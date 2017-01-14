import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
// import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module MentorAnswers */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseCollection
 */
class MentorAnswersCollection extends BaseCollection {
  /**
   * Creates the Mentor Answer collection.
   */
  constructor() {
    super('MentorAnswers', new SimpleSchema({
      questionID: { type: String },
      mentor: { type: String },  // TODO: Mentor should be a userID, not a string.
      slug: { type: String },
      text: { type: String },
    }));
  }

  /**
   * Defines the help for a given questionID.
   * @param questionID the question ID.
   * @param mentor the mentor who answered the question.
   * @param slug
   * @param text the answer text.
   * @return {any} the ID of the answer.
   */
  define({ questionID, mentor, slug, text }) {
    return this._collection.insert({ questionID, mentor, slug, text });
  }

  /**
   * Returns the text for the given questionID.
   * @param questionID
   */
  getMentorAnswerText(questionID) {
    return this._collection.findOne({ questionID }).text;
  }

  /**
   * Returns the title for the given questionID.
   * @param questionID
   */
  getMentor(questionID) {
    return this._collection.findOne({ questionID }).mentor;
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    return [];
  }


}

export const MentorAnswers = new MentorAnswersCollection();
// radgradCollections.push(MentorAnswers);

