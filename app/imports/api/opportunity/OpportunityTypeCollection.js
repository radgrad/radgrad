import BaseTypeCollection from '../base/BaseTypeCollection';
import { RadGrad } from '../base/RadGrad';

/** @module api/opportunity/OpportunityTypeCollection */

/**
 * OpportunityTypes help organize Opportunities into logically related groupings such as "Internships", "Clubs", etc.
 * @extends module:api/base/BaseTypeCollection~BaseTypeCollection
 */
class OpportunityTypeCollection extends BaseTypeCollection {

  /**
   * Creates the OpportunityType collection.
   */
  constructor() {
    super('OpportunityType');
  }

  /**
   * Defines a new OpportunityType with its name, slug, and description.
   * @example
   * OpportunityTypes.define({ name: 'Research', slug: 'research', description: 'A research project.' });
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
export const OpportunityTypes = new OpportunityTypeCollection();
RadGrad.collections.push(OpportunityTypes);

