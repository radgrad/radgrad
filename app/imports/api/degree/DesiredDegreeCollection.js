import BaseTypeCollection from '/imports/api/base/BaseTypeCollection';

/** @module DesiredDegree */

/**
 * DesiredDegrees specifies the set of degrees possible in this department.
 * @extends module:BaseType~BaseTypeCollection
 */
class DesiredDegreeCollection extends BaseTypeCollection {

  /**
   * Creates the DesiredDegree collection.
   */
  constructor() {
    super('DesiredDegree');
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
    return super.define({ name, slug, description });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const DesiredDegrees = new DesiredDegreeCollection();
