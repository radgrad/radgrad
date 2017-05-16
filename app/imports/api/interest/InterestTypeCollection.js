import BaseTypeCollection from '/imports/api/base/BaseTypeCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module api/interest/InterestTypeCollection */

/**
 * InterestTypes help organize Interests into logically related groupings such as "CS-Disciplines", "Locations", etc.
 * @extends module:api/base/BaseTypeCollection~BaseTypeCollection
 */
class InterestTypeCollection extends BaseTypeCollection {

  /**
   * Creates the InterestType collection.
   */
  constructor() {
    super('InterestType');
  }

  /**
   * Defines a new InterestType with its name, slug, and description.
   * @example
   * InterestTypes.define({ name: 'Locations', slug: 'locations', description: 'Regions of interest.' });
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  define({ name, slug, description }) {
    return super.define({ name, slug, description });
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const InterestTypes = new InterestTypeCollection();
radgradCollections.push(InterestTypes);

