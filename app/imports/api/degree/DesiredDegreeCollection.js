import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/** @module DesiredDegree */

/**
 * DesiredDegrees specifies the set of degrees possible in this department.
 * @extends module:BaseType~BaseTypeCollection
 */
class DesiredDegreeCollection extends BaseInstanceCollection {

  /**
   * Creates the DesiredDegree collection.
   */
  constructor() {
    super('DesiredDegree', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
    }));
  }

  /**
   * Defines a new DesiredDegree with its name, slug, and description.
   * @example
   * DesiredDegrees.define({ name: 'B.S. in Computer Science',
   *                         slug: 'bs-cs',
   *                         description: 'Focuses on software technology and provides a foundation in math.' });
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  define({ name, slug, description }) {
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const desiredDegreeID = this._collection.insert({ name, slugID, description });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, desiredDegreeID);
    return desiredDegreeID;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const DesiredDegrees = new DesiredDegreeCollection();
