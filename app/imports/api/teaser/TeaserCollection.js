import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '../slug/SlugCollection';
import BaseInstanceCollection from '../base/BaseInstanceCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { radgradCollections } from '../base/RadGradCollections';
import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module api/teaser/TeaserCollection */

/**
 * Represents a teaser instance, such as "ACM Webmasters".
 * @extends module:api/base/BaseInstanceCollection~BaseInstanceCollection
 */
class TeaserCollection extends BaseInstanceCollection {

  /**
   * Creates the Teaser collection.
   */
  constructor() {
    super('Teaser', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      author: { type: String },
      url: { type: String },
      description: { type: String },
      duration: { type: String },
      interestIDs: { type: [SimpleSchema.RegEx.Id] },
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
  }

  /**
   * Defines a new Teaser and its associated Slug.
   * @example
   * Teaser.define({ title: 'ACM Webmasters',
   *                 slug: 'acm-webmasters',
   *                 author: 'Torlief Nielson'
   *                 url: 'https://www.youtube.com/watch?v=OI4CXULK3tw'
   *                 description: 'Learn web development by helping to develop and maintain the ACM Manoa website.',
   *                 duration: '0:39'
   *                 interests: ['html', 'javascript', 'css', 'web-development'],
   *                 opportunities: 'acm-webmasters'
   * @param { Object } description Object with keys title, slug, URL, description, duration. interestIDs.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * Opportunity must be a defined opportunity slug or opportunityID
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID,
   * if the slug is already defined, or if the opportunity is undefined
   * @returns The newly created docID.
   */
  define({ title, slug, author, url, description, duration, interests, opportunity }) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    let opportunityID;
    if (opportunity) {
      const opportunitySlug = Slugs.find({ name: opportunity }).fetch();
      const opp = Opportunities.find({ slugID: opportunitySlug[0]._id }).fetch();
      opportunityID = opp[0]._id;
    }
    const teaserID = this._collection.insert({ title, slugID, author, url,
      description, duration, interestIDs, opportunityID });
    // Connect the Slug to this teaser
    Slugs.updateEntityID(slugID, teaserID);
    return teaserID;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, interestIDs
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
      if (!Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Teaser docID in a format acceptable to define().
   * @param docID The docID of a Teaser.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const slug = Slugs.getNameFromID(doc.slugID);
    const author = doc.author;
    const url = doc.url;
    const description = doc.description;
    const duration = doc.duration;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    let opportunity;
    if (doc.opportunityID) {
      opportunity = Opportunities.findSlugByID(doc.opportunityID);
    }
    return { title, slug, author, url, description, duration, interests, opportunity };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Teasers = new TeaserCollection();
radgradCollections.push(Teasers);
