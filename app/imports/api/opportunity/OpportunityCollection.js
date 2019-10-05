import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../slug/SlugCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { assertICE } from '../ice/IceProcessor';

/**
 * Represents an Opportunity, such as "LiveWire Internship".
 * To represent an Opportunity taken by a specific student in a specific semester, use OpportunityInstance.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/opportunity
 */
class OpportunityCollection extends BaseSlugCollection {
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
      interestIDs: [SimpleSchema.RegEx.Id],
      semesterIDs: [SimpleSchema.RegEx.Id],
      // Optional data
      eventDate: { type: Date, optional: true },
      ice: { type: Object, optional: true, blackbox: true },
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new Opportunity.
   * @example
   * Opportunities.define({ name: 'ATT Hackathon',
   *                        slug: 'att-hackathon',
   *                        description: 'Programming challenge at Sacred Hearts Academy, $10,000 prize',
   *                        opportunityType: 'event',
   *                        sponsor: 'philipjohnson',
   *                        ice: { i: 10, c: 0, e: 10},
   *                        interests: ['software-engineering'],
   *                        semesters: ['Fall-2016', 'Spring-2016', 'Summer-2106'],
     *                      });
   * @param { Object } description Object with keys name, slug, description, opportunityType, sponsor, interests,
   * Slug must not be previously defined.
   * OpportunityType and sponsor must be defined slugs.
   * Interests must be a (possibly empty) array of interest slugs or IDs.
   * Semesters must be a (possibly empty) array of semester slugs or IDs.
   * Sponsor must be a User with role 'FACULTY', 'ADVISOR', or 'ADMIN'.
   * ICE must be a valid ICE object.
   * retired a boolean optional defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest, sponsor, opportunityType,
   * or startActive or endActive are not valid.
   * @returns The newly created docID.
   */
  define({ name, slug, description, opportunityType, sponsor, interests, semesters, ice, eventDate = null, retired }) {
    // Get instances, or throw error
    const opportunityTypeID = OpportunityTypes.getID(opportunityType);
    const sponsorID = Users.getID(sponsor);
    Users.assertInRole(sponsorID, [ROLE.FACULTY, ROLE.ADVISOR, ROLE.ADMIN]);
    assertICE(ice);
    const interestIDs = Interests.getIDs(interests);
    // Define the slug
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const semesterIDs = Semesters.getIDs(semesters);
    let opportunityID;
    if (eventDate !== null) {
      // Define the new Opportunity and its Slug.
      opportunityID = this._collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, semesterIDs, ice, eventDate, retired });
    } else {
      opportunityID = this._collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, semesterIDs, ice, retired });
    }
    Slugs.updateEntityID(slugID, opportunityID);

    // Return the id to the newly created Opportunity.
    return opportunityID;
  }

  /**
   * Update an Opportunity.
   * @param instance The docID or slug associated with this opportunity.
   * @param name optional.
   * @param description optional.
   * @param opportunityType docID or slug (optional.)
   * @param sponsor user in role admin, advisor, or faculty. optional.
   * @param interests optional.
   * @param semesters optional
   * @param eventDate a Date. (optional)
   * @param ice An ICE object (optional).
   * @param retired a boolean (optional).
   */
  update(instance, { name, description, opportunityType, sponsor, interests, semesters, eventDate, ice, retired }) {
    const docID = this.getID(instance);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (opportunityType) {
      const opportunityTypeID = OpportunityTypes.getID(opportunityType);
      updateData.opportunityTypeID = opportunityTypeID;
    }
    if (sponsor) {
      const sponsorID = Users.getID(sponsor);
      Users.assertInRole(sponsorID, [ROLE.FACULTY, ROLE.ADVISOR, ROLE.ADMIN]);
      updateData.sponsorID = sponsorID;
    }
    if (interests) {
      const interestIDs = Interests.getIDs(interests);
      updateData.interestIDs = interestIDs;
    }
    if (semesters) {
      const semesterIDs = Semesters.getIDs(semesters);
      updateData.semesterIDs = semesterIDs;
    }
    if (eventDate) {
      updateData.eventDate = eventDate;
    }
    if (ice) {
      assertICE(ice);
      updateData.ice = ice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Opportunity.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Opportunity, or if this opportunity has any associated opportunity
   * instances.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    // Check that this opportunity is not referenced by any Opportunity Instance.
    OpportunityInstances.find().map(function (opportunityInstance) { // eslint-disable-line array-callback-return
      if (opportunityInstance.opportunityID === docID) {
        throw new Meteor.Error(`Opportunity ${instance} referenced by a opportunity instance ${opportunityInstance}.`,
          '', Error().stack);
      }
    });
    // Check that this opportunity is not referenced by any Teaser.
    Teasers.find().map(function (teaser) { // eslint-disable-line array-callback-return
      if (Teasers.hasTarget(teaser, docID)) {
        throw new Meteor.Error(`Opportunity ${instance} referenced by a teaser ${teaser}.`, '', Error().stack);
      }
    });
    // OK to delete. First remove any Feeds that reference this opportunity.
    Feeds.find({ opportunityID: docID }).map(function (feed) { // eslint-disable-line array-callback-return
      Feeds.removeIt(feed._id);
    });
    super.removeIt(docID);
  }

  /**
   * Asserts that userId is logged in as an Admin, Faculty, or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not in the allowed roles.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
  }


  /**
   * Returns the OpportunityType associated with the Opportunity with the given instanceID.
   * @param instanceID The id of the Opportunity.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityTypeDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return OpportunityTypes.findDoc(instance.opportunityTypeID);
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

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, opportunityTypeID, sponsorID, interestIDs, semesterIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!OpportunityTypes.isDefined(doc.opportunityTypeID)) {
        problems.push(`Bad opportunityTypeID: ${doc.opportunityTypeID}`);
      }
      if (!Users.isDefined(doc.sponsorID)) {
        problems.push(`Bad sponsorID: ${doc.sponsorID}`);
      }
      _.forEach(doc.interestIDs, interestID => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
      _.forEach(doc.semesterIDs, semesterID => {
        if (!Semesters.isDefined(semesterID)) {
          problems.push(`Bad semesterID: ${semesterID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns true if Opportunity has the specified interest.
   * @param opportunity The opportunity(docID or slug)
   * @param interest The Interest (docID or slug).
   * @returns {boolean} True if the opportunity has the associated Interest.
   * @throws { Meteor.Error } If opportunity is not a opportunity or interest is not a Interest.
   */
  hasInterest(opportunity, interest) {
    const interestID = Interests.getID(interest);
    const doc = this.findDoc(opportunity);
    return _.includes(doc.interestIDs, interestID);
  }

  /**
   * Returns an object representing the Opportunity docID in a format acceptable to define().
   * @param docID The docID of an Opportunity.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const opportunityType = OpportunityTypes.findSlugByID(doc.opportunityTypeID);
    const sponsor = Users.getProfile(doc.sponsorID).username;
    const description = doc.description;
    const ice = doc.ice;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const semesters = _.map(doc.semesterIDs, semesterID => Semesters.findSlugByID(semesterID));
    const eventDate = doc.eventDate;
    const retired = doc.retired;
    return { name, slug, description, opportunityType, sponsor, ice, interests, semesters, eventDate, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/opportunity.OpportunityCollection}
 * @memberOf api/opportunity
 */
export const Opportunities = new OpportunityCollection();
