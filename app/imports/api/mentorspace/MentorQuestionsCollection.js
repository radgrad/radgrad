import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '../user/UserCollection';

/** @module MentorQuestions */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseCollection
 */
class MentorQuestionsCollection extends BaseCollection {
  /**
   * Creates the Mentor Answer collection.
   */
  constructor() {
    super('MentorQuestions', new SimpleSchema({
      questionID: { type: String },
      mentor: { type: String },
      text: { type: String }
    }));
  }

  /**
   * Defines the help for a given routeName.
   * @param questionID the route name.
   * @param mentor the title of the help.
   * @param text the help text.
   * @return {any} the ID of the help.
   */
  define({ questionID, mentor, text }) {
    return this._collection.insert({ questionID, mentor, text });
  }

  /**
   * Returns the text for the given routeName.
   * @param questionID
   */
  getMentorAnswerText(questionID) {
    return this._collection.findOne({ questionID }).text;
  }

  /**
   * Returns the title for the given routeName.
   * @param questionID
   */
  getMentor(questionID) {
    return this._collection.findOne({ questionID }).mentor;
  }
}

export const MentorQuestions = new MentorQuestionsCollection();
