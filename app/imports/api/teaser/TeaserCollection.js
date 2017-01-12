import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection.js';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';

import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module Teaser */

/**
 * Represents a teaser instance, such as "ACM Webmasters".
 * @extends module:BaseInstance~BaseInstanceCollection
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
      opportunityID: { type: SimpleSchema.RegEx.Id },
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
   * @param { Object } description Object with keys title, slug, URL, description, duration. interestIDs.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID.
   * @returns The newly created docID.
   */
  define({ title, slug, author, url, description, duration, interests, opportunity }) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const opportunityID = opportunity;
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
    });
    return problems;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Teasers = new TeaserCollection();
radgradCollections.push(Teasers);
