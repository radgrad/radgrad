import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';

/** @module MentorAnswers */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseCollection
 */
class MentorProfilesCollection extends BaseCollection {
  /**
   * Creates the Mentor Answer collection.
   */
  constructor() {
    super('MentorProfiles', new SimpleSchema({
      mentorID: { type: SimpleSchema.RegEx.Id },
      company: { type: String },
      career: { type: String },
      location: { type: String },
      linkedin: { type: String },
      motivation: { type: String },
    }));
  }

  /**
   * Defines the help for a given questionID.
   * @param mentorID the mentor ID.
   * @param company the company the mentor is a member of.
   * @param career the mentor's title.
   * @param location the mentor's location
   * @param linkedin the mentor's LinkedIn user ID.
   * @param motivation the reason why the user mentors.
   * @return {any} the ID of the answer.
   */
  define({ mentorID, company, career, location, linkedin, motivation }) {
    return this._collection.insert({ mentorID, company, career, location, linkedin, motivation });
  }

  getMentorProfile(mentorID) {
    return this._collection.find({ mentorID });
  }


  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this

  }


}

export const MentorProfiles = new MentorProfilesCollection();
radgradCollections.push(MentorProfiles);

