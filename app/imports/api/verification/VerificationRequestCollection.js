import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
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
    }));
    this.ACCEPTED = 'Accepted';
    this.REJECTED = 'Rejected';
    this.OPEN = 'Open';
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const VerificationRequests = new VerificationRequestCollection();

