import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';


/** @module OpportunityInstance */

/**
 * OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.
 * @extends module:Base~BaseCollection
 */
class OpportunityInstanceCollection extends BaseCollection {

  /**
   * Creates the OpportunityInstance collection.
   */
  constructor() {
    super('OpportunityInstance', new SimpleSchema({
      semesterID: { type: SimpleSchema.RegEx.Id },
      opportunityID: { type: SimpleSchema.RegEx.Id },
      verified: { type: Boolean },
      studentID: { type: SimpleSchema.RegEx.Id },
      ice: { type: Object, optional: true, blackbox: true },
    }));
  }

  /**
   * Defines a new OpportunityInstance.
   * @example
   * OpportunityInstances.define({ semester: 'Fall-2015',
   *                               opportunity: 'hack2015',
   *                               verified: false,
   *                               student: 'joesmith' });
   * @param { Object } description Semester, opportunity, and student must be slugs or IDs. Verified defaults to false.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */

  define({ semester, opportunity, verified = false, student }) {
    // Validate semester, opportunity, verified, and studentID
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    const opportunityID = Opportunities.getID(opportunity);
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    const ice = Opportunities.findDoc(opportunityID).ice;
    // Define and return the new OpportunityInstance
    const opportunityInstanceID = this._collection.insert({ semesterID, opportunityID, verified, studentID, ice });
    return opportunityInstanceID;
  }

  /**
   * @returns {String} This opportunity instance, formatted as a string.
   * @param opportunityInstanceID The opportunity instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(opportunityInstanceID) {
    this.assertDefined(opportunityInstanceID);
    const opportunityInstanceDoc = this.findDoc(opportunityInstanceID);
    const semester = Semesters.toString(opportunityInstanceDoc.semesterID);
    const opportunityName = Opportunities.findDoc(opportunityInstanceDoc.opportunityID).name;
    return `[OI ${semester} ${opportunityName}]`;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const OpportunityInstances = new OpportunityInstanceCollection();
