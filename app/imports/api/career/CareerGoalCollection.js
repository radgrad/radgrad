import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { _ } from 'meteor/erasaur:meteor-lodash';


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

  /**
   * Returns a list of Career Goal names corresponding to the passed list of CareerGoal docIDs.
   * @param instanceIDs A list of Career Goal docIDs.
   * @returns { Array } An array of name strings.
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(instanceIDs) {
    return instanceIDs.map(instanceID => this.findDoc(instanceID).name);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestIDs.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      _.forEach(doc.interestIDs, interestID => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the CareerGoal docID in a format acceptable to define().
   * @param docID The docID of a CareerGoal.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const moreInformation = doc.moreInformation;
    return { name, slug, interests, description, moreInformation };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const CareerGoals = new CareerGoalCollection();
radgradCollections.push(CareerGoals);
