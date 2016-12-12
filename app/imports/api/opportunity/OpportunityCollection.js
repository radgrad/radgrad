import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { assertICE } from '/imports/api/ice/IceProcessor';

/** @module Opportunity */

/**
 * Represents an Opportunity, such as "LiveWire Internship".
 * To represent an Opportunity taken by a specific student in a specific semester, use OpportunityInstance.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class OpportunityCollection extends BaseInstanceCollection {

  /**
   * Creates the Opportunity collection.
   */
  constructor() {
    super('Opportunity', new SimpleSchema({
      name: { type: String },
      slugID: { type: String },
      description: { type: String },
      opportunityTypeID: { type: SimpleSchema.RegEx.Id },
      sponsorID: { type: SimpleSchema.RegEx.Id },
      interestIDs: { type: [SimpleSchema.RegEx.Id] },
      iconURL: { type: SimpleSchema.RegEx.Url, optional: true },
      semesterIDs: { type: [SimpleSchema.RegEx.Id] },
      eventDate: { type: Date, optional: true },
      independentStudy: { type: Boolean },
      // Optional data
      moreInformation: { type: String, optional: true },
      ice: { type: Object, optional: true, blackbox: true },
    }));
  }

  /**
   * Defines a new Opportunity.
   * @example
   * Opportunitys.define({ name: 'ATT Hackathon 2015',
   *                       slug: 'hack15',
   *                       description: 'Programming challenge at Sacred Hearts Academy, $10,000 prize',
   *                       opportunityType: 'event',
   *                       sponsor: 'philipjohnson',
   *                       ice: { i: 10, c: 0, e: 10},
   *                       interests: ['software-engineering'],
   *                       semesters: ['Fall-2016', 'Spring-2016', 'Summer-2106'],
    *                      moreInformation: 'http://atthackathon.com',
     *                     independentStudy: true});
   * @param { Object } description Object with keys name, slug, description, opportunityType, sponsor, interests,
   * startActive, and endActive.
   * Slug must not be previously defined.
   * OpportunityType and sponsor must be defined slugs.
   * Interests must be a (possibly empty) array of interest slugs.
   * Sponsor must be a User with role 'FACULTY'.
   * ICE must be a valid ICE object.
   * MoreInformation is optional, but if supplied should be a URL.
   * IndependentStudy is optional and defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest, sponsor, opportunityType,
   * or startActive or endActive are not valid.
   * @returns The newly created docID.
   */
  define({ name, slug, description, opportunityType, sponsor, interests, semesters, moreInformation,
  independentStudy = false, ice, eventDate = null }) {
    // Get instances, or throw error

    const opportunityTypeID = OpportunityTypes.getID(opportunityType);
    const sponsorID = Users.getID(sponsor);
    Users.assertInRole(sponsorID, [ROLE.FACULTY, ROLE.ADVISOR]);
    assertICE(ice);
    const interestIDs = Interests.getIDs(interests);
    // Define the slug
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const semesterIDs = [];
    semesters.forEach((semSlug) => {
      semesterIDs.push(Semesters.findIdBySlug(semSlug));
    });
    // Guarantee that independentStudy is a boolean.
    /* eslint no-param-reassign: "off" */
    independentStudy = !!independentStudy;
    let opportunityID;
    if (eventDate !== null) {
      // Define the new Opportunity and its Slug.
      opportunityID = this._collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, semesterIDs, moreInformation, independentStudy, ice, eventDate });
    } else {
      opportunityID = this._collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, semesterIDs, moreInformation, independentStudy, ice });
    }
    Slugs.updateEntityID(slugID, opportunityID);

    // Return the id to the newly created Opportunity.
    return opportunityID;
  }

  /**
   * Returns the OpportunityType associated with the Opportunity with the given instanceID.
   * @param instanceID The id of the Opportunity.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityTypeDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.find({ _id: instanceID });
    return OpportunityTypes.findDoc(instance.opportunityTypeID);
  }

  /**
   * Removes the passed Opportunity and its associated Slug.
   * @param opportunity The document or _id associated with this Opportunity.
   * @throws {Meteor.Error} If opportunity is not defined or there are any OpportunityInstances associated with it.
   */
  removeIt(opportunity) {
    // TODO: check for defined OpportunityInstances before deletion.
    super.removeIt(opportunity);
  }

  /**
   * Returns the slug for the given opportunity ID.
   * @param opportunityID the opportunity ID.
   */
  getSlug(opportunityID) {
    this.assertDefined(opportunityID);
    const courseDoc = this.findDoc(opportunityID);
    return Slugs.findDoc(courseDoc.slugID).name;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Opportunities = new OpportunityCollection();

