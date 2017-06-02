import BaseTypeCollection from '../base/BaseTypeCollection';


/** @module api/feed/FeedTypeCollection */

/**
 * FeedTypes help organize Feeds into logically related groupings such as "new-course", "new-user", etc.
 * @extends module:api/base/BaseTypeCollection~BaseTypeCollection
 */
class FeedTypeCollection extends BaseTypeCollection {

  /**
   * Creates the FeedType collection.
   */
  constructor() {
    super('FeedType');
  }

  /**
   * Defines a new FeedType with its name and slug.
   * @example
   * FeedTypes.define({ name: 'New Course', slug: 'new-course' });
   * @param { Object } description Object with keys name, slug and description.
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
export const FeedTypes = new FeedTypeCollection();

