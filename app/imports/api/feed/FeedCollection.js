import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '/imports/api/user/UserCollection';

import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

/** @module Feed */

/**
 * Represents a feed instance.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class FeedCollection extends BaseInstanceCollection {

  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      timestamp: { type: Number },
    }));
  }

  /**
   * Defines a new Feed.
   * @example
   * Teaser.define({ student: 'abigailkealoha',
   *                    description: 'has leveled up to Level 1!',
   *                    timestamp: '12345465465',
   * @param { Object } description Object with keys student, description, and timestamp.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID.
   * @returns The newly created docID.
   */
  define({ student, description, timestamp }) {
    const studentID = Users.getID(student);
    const feedID = this._collection.insert({ studentID, description, timestamp });
    return feedID;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feed = new FeedCollection();

