import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { Slugs } from '../slug/SlugCollection';

/**
 * DesiredDegrees specifies the set of degrees possible in this department.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/degree-plan
 */
class DesiredDegreeCollection extends BaseSlugCollection {
  /**
   * Creates the DesiredDegree collection.
   */
  constructor() {
    super('DesiredDegree', new SimpleSchema({
      name: { type: String },
      shortName: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new DesiredDegree with its name, slug, and description.
   * @example
   * DesiredDegrees.define({ name: 'B.S. in Computer Science',
   *                         shortName: 'B.S. CS',
   *                         slug: 'bs-cs',
   *                         description: 'Focuses on software technology and provides a foundation in math.' });
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * ShortName defaults to name if not supplied.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  define({
    name, shortName = name, slug, description, retired,
  }) {
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const desiredDegreeID = this._collection.insert({
      name, shortName, slugID, description, retired,
    });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, desiredDegreeID);
    return desiredDegreeID;
  }

  /**
   * Update a DesiredDegree.
   * @param instance The docID (or slug) associated with this degree.
   * @param name the name of this degree.
   * @param shortName the short name of this degree.
   * @param description the description of this degree.
   */
  update(instance, {
    name, shortName, description, retired,
  }) {
    const docID = this.getID(instance);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (shortName) {
      updateData.shortName = shortName;
    }
    if (description) {
      updateData.description = description;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = true;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the DesiredDegree.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a DesiredDegree, or if this degree has any associated academic plans or
   * is referenced by any user.
   */
  removeIt(instance) {
    const desiredDegreeID = this.getID(instance);
    // Check that this is not referenced by any AcademicPlans.
    AcademicPlans.find()
      .map(function (plan) { // eslint-disable-line array-callback-return
        if (plan.degreeID === desiredDegreeID) {
          throw new Meteor.Error(`DesiredDegree ${instance} is referenced by a academic plan ${plan}.`,
            '', Error().stack);
        }
      });
    super.removeIt(desiredDegreeID);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Slugs.isDefined(doc.slugID)) {
          problems.push(`Bad slugID: ${doc.slugID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the DesiredDegree docID in a format acceptable to define().
   * @param docID The docID of a DesiredDegree.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { name } = doc;
    const { shortName } = doc;
    const slug = Slugs.getNameFromID(doc.slugID);
    const { description } = doc;
    const { retired } = doc;
    return {
      name, shortName, slug, description, retired,
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const DesiredDegrees = new DesiredDegreeCollection();
