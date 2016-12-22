import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '../user/UserCollection';

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
      mentor: { type: String },
      text: { type: String }
    }));
  }

  /**
   * Defines the help for a given questionID.
   * @param questionID the question ID.
   * @param mentor the mentor who answered the question.
   * @param text the answer text.
   * @return {any} the ID of the answer.
   */
  define({ questionID, mentor, text }) {
    return this._collection.insert({ questionID, mentor, text });
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


}

export const MentorAnswers = new MentorAnswersCollection();
