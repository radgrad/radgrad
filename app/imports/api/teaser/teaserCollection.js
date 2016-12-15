import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

/** @module Teaser */

/**
 * Represents a teaser instance, such as "ACM Webmasters".
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class TeaserCollection extends BaseInstanceCollection {

  /**
   * Creates the Teaser collection.
   */
  constructor() {
    super('Teaser', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      URL: { type: String },
      description: { type: String },
      duration: { type: Number },
      interestIDs: { type: [SimpleSchema.RegEx.Id] },
    }));
  }

  /**
   * Defines a new Teaser and its associated Slug.
   * @example
   * Teaser.define({ title: 'ACM Webmasters',
   *                    slugID: 'acm-webmasters',
   *                    URL: 'https://www.youtube.com/watch?v=OI4CXULK3tw'
   *                    description: 'Learn web development by helping to develop and maintain the ACM Manoa website.',
   *                    duration: '0:39'
   *                    interestIDs: ['html', 'javascript', 'css', 'web-development'],
   * @param { Object } description Object with keys title, slug, URL, description, duration. interestIDs.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID.
   * @returns The newly created docID.
   */
  define({ title, slug, url, description, duration, interests }) {
    // Get InterestTypeID, throw error if not found.
    const interestTypeID = InterestTypes.getID(interestType);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the Interest and get its ID
    const interestID = this._collection.insert({ name, description, slugID, interestTypeID, moreInformation });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
    return interestID;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param instanceIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(instanceIDs) {
    return instanceIDs.map(instanceID => this.findDoc(instanceID).name);
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Interests = new InterestCollection();

