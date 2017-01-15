import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

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
    super('MentorAnswer', new SimpleSchema({
      questionID: { type: SimpleSchema.RegEx.Id },
      mentorID: { type: SimpleSchema.RegEx.Id },
      text: { type: String },
    }));
  }

  /**
   * Defines the help for a given questionID.
   * @param question the question ID.
   * @param mentorID ID of the mentor who answered the question.
   * @param text the answer text.
   * @return {any} the ID of the answer.
   */
  define({ question, mentorID, text }) {
    return this._collection.insert({ questionID: question, mentorID, text });
  }

  /**
   * Returns the text for the given questionID.
   * @param question
   */
  getAnswers(question) {
    const slug = Slugs.findDoc(question);
    return this._collection.find({ questionID: slug.name });
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
radgradCollections.push(MentorAnswers);

