import BaseTypeCollection from '../base/BaseTypeCollection';


/**
 * OpportunityTypes help organize Opportunities into logically related groupings such as "Internships", "Clubs", etc.
 * @extends api/base.BaseTypeCollection
 * @memberOf api/opportunity
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
 * @type {api/opportunity.OpportunityTypeCollection}
 * @memberOf api/opportunity
 */
export const OpportunityTypes = new OpportunityTypeCollection();

