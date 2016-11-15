import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { Opportunities } from '/imports/api/opportunity/OppoturnityCollection.js';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection.js';
import { assertICE } from '/imports/api/ice/IceProcessor';
import { moment } from 'meteor/momentjs:moment';

/** @module Verification */

const ProcessedSchema = new SimpleSchema({
  date: { type: Date },
  status: { type: String },
});

/**
 * Represents a Verification Request, such as "LiveWire Internship".
 * A student has completed an opportunity (such as an internship or project) and wants to obtain ICE Points by
 * having it verified.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class VerificationRequestCollection extends BaseInstanceCollection {

  /**
   * Creates the VerificationRequest collection.
   */
  constructor() {
    super('VerificationRequest', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      opportunityInstanceID: { type: SimpleSchema.RegEx.Id },
      submittedOn: { type: Date },
      processed: { type: [ProcessedSchema] },
      ice: { type: Object, optional: true, blackbox: true },
    }));
    this.ACCEPTED = 'Accepted';
    this.REJECTED = 'Rejected';
    this.OPEN = 'Open';
  }

  /**
   * Defines a verification request.
   * @example
   * VerificationRequests.define({ student: 'joesmith', opportunity: 'hack2015' });
   * @param { Object } student and opportunity must be slugs or IDs. SubmittedOn defaults to now.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */
  define({ student, opportunity, submittedOn = moment() }) {
    const studentID = Users.getID(student);
    const opportunityInstanceID = OpportunityInstances.getID(opportunity);
    const oppInstance = OpportunityInstances.findDoc(opportunityInstanceID);
    const ice = Opportunities.findDoc(oppInstance.opportunityID).ice;
    const processed = [];
    // Define and return the new OpportunityInstance
    const requestID = this._collection.insert({ studentID, opportunityInstanceID, submittedOn, processed, ice });
    return requestID;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const VerificationRequests = new VerificationRequestCollection();

