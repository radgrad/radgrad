import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Users } from '/imports/api/user/UserCollection';

import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

/** @module Feed */

/**
 * Represents a feed instance, such as "abi-level1".
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
   * Defines a new Feed and its associated Slug.
   * @example
   * Teaser.define({ student: 'abigailkealoha',
   *                    slugID: 'abi-level1',
   *                    description: 'has leveled up to Level 1!',
   *                    timestamp: 'https://www.youtube.com/watch?v=OI4CXULK3tw',
   * @param { Object } description Object with keys title, slug, URL, description, duration. interestIDs.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID.
   * @returns The newly created docID.
   */
  define({ student, description, timestamp }) {
    // Get SlugID, throw error if found.
    const studentID = Users.getID(student);
    const feedID = this._collection.insert({ studentID, description, timestamp });
    // Connect the Slug to this teaser
    return feedID;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feed = new FeedCollection();

