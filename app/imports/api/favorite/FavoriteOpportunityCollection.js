import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { Opportunities } from '../opportunity/OpportunityCollection';

class FavoriteOpportunityCollection extends BaseCollection {

  /** Creates the FavoriteOpportunity collection */
  constructor() {
    super('FavoriteOpportunity', new SimpleSchema({
      opportunityID: SimpleSchema.RegEx.Id,
      studentID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      scoreboard: `${this._collectionName}.scoreboard`,
    };
  }

  /**
   * Defines a new FavoriteOpportunity.
   * @param opportunity the opportunity slug.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ opportunity, student, retired = false }) {
    const opportunityID = Opportunities.getID(opportunity);
    const studentID = Users.getID(student);
    return this._collection.insert({ opportunityID, studentID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the FavoriteOpportunity.
   * @param retired the new retired value.
   */
  update(docID, { retired }) {
    this.assertDefined(docID);
    const updateData = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the FavoriteOpportunity.
   * @param docID The docID of the FavoriteOpportunity.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Removes all the FavoriteOpportunities for the user.
   * @param user the username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this._collection.remove({ studentID });
  }

  /**
   * Publish OpportunityFavorites. If logged in as ADMIN get all, otherwise only get the OpportunityFavorites for the
   * studentID.
   * Also publishes the OpportunityFavorites scoreboard.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function filterStudentID(studentID) { // eslint-disable-line
        if (!studentID) {
          return this.ready();
        }
        if (Roles.userIsInRole(studentID, [ROLE.ADMIN])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
      Meteor.publish(this.publicationNames.scoreboard, function publishOpportunityScoreboard() {
        ReactiveAggregate(this, instance._collection, [
          {
            $group: {
              _id: '$opportunityID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, opportunityID: 1 } },
        ], { clientCollection: 'OpportunityFavoritesScoreboard' });
      });
    }
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the Opportunity associated with the FavoriteOpportunity with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Opportunities.findDoc(instance.opportunityID);
  }

  /**
   * Returns the Opportunity slug for the favorite's corresponding Opportunity.
   * @param instanceID The FavoriteOpportunity ID.
   * @return {string} The opportunity slug.
   */
  getOpportunitySlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Opportunities.getSlug(instance.opportunityID);
  }

  /**
   * Returns the Student profile associated with the FavoriteOpportunity with the given instanceID.
   * @param instanceID The ID of the FavoriteOpportunity.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * Returns the username associated with the studentID.
   * @param instanceID the FavoriteOpportunity id.
   * @returns {*}
   */
  getStudentUsername(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID).username;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks semesterID, opportunityID, and studentID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Opportunities.isDefined(doc.opportunityID)) {
          problems.push(`Bad opportunityID: ${doc.opportunityID}`);
        }
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the FavoriteOpportunity docID in a format acceptable to define().
   * @param docID The docID of a FavoriteOpportunity.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const opportunity = Opportunities.findSlugByID(doc.opportunityID);
    const student = Users.getProfile(doc.studentID).username;
    const retired = doc.retired;
    return { opportunity, student, retired };
  }

}

export const FavoriteOpportunities = new FavoriteOpportunityCollection();
