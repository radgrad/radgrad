import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

/** @module CareerGoal */

/**
 * CareerGoals represent the professional future(s) that the student wishes to work toward.
 * Note: Career Goals will probably need to be defined with a hook function that provides recommendations based upon
 * the specifics of the career. At that point, we'll probably need a new Base class that this class will extend.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class CareerGoalCollection extends BaseInstanceCollection {

  /**
   * Creates the CareerGoal collection.
   */
  constructor() {
    super('CareerGoal', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interestIDs: { type: [SimpleSchema.RegEx.Id] },
      // Optional data
      moreInformation: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new CareerGoal with its name, slug, and description.
   * @example
   * CareerGoals.define({ name: 'Database Administrator',
   *                      slug: 'database-administrator',
   *                      description: 'Wrangler of SQL.',
   *                      interests: ['application-development', 'software-engineering', 'databases'],
   *                      moreInformation: 'http://www.bls.gov/ooh/database-administrators.htm' });
   * @param { Object } description Object with keys name, slug, description, interests, and moreInformation.
   * Slug must be globally unique and previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * Syllabus is optional. If supplied, should be a URL.
   * MoreInformation is optional. If supplied, should be a URL.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  define({ name, slug, description, interests, moreInformation }) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this._collection.insert({ name, slugID, description, interestIDs, moreInformation });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const CareerGoals = new CareerGoalCollection();
