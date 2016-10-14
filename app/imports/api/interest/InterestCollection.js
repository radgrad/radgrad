import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

/** @module Interest */

/**
 * Represents a specific interest, such as "Software Engineering".
 * Note that all Interests must have an associated InterestType.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class InterestCollection extends BaseInstanceCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Interest', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interestTypeID: { type: SimpleSchema.RegEx.Id },
      // Optional data
      moreInformation: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new Interest and its associated Slug.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    slug: 'software-engineering',
   *                    description: 'Methods for group development of large, high quality software systems',
   *                    interestType: 'cs-disciplines',
   *                    moreInformation: 'http://softwareengineering.com' });
   * @param { Object } description Object with keys name, slug, description, interestType, moreInformation.
   * Slug must be previously undefined.
   * InterestType must be an InterestType slug or ID.
   * MoreInformation is optional but if supplied should be a URL.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({ name, slug, description, interestType, moreInformation }) {
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

