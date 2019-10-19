import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseCollection from '../base/BaseCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';

class FavoriteAcademicPlanCollection extends BaseCollection {
  /** Creates the FavoriteAcademicPlan collection */
  constructor() {
    super('FavoriteAcademicPlan', new SimpleSchema({
      academicPlanID: SimpleSchema.RegEx.Id,
      studentID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      scoreboard: `${this._collectionName}.scoreboard`,
    };
  }

  /**
   * Defines a new FavoriteAcademicPlan.
   * @param academicPlan the academicPlan slug.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ academicPlan, student, retired = false }) {
    const academicPlanID = AcademicPlans.getID(academicPlan);
    const studentID = Users.getID(student);
    const doc = this._collection.findOne({ studentID, academicPlanID });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ academicPlanID, studentID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the FavoriteAcademicPlan.
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
   * Remove the FavoriteAcademicPlan.
   * @param docID The docID of the FavoriteAcademicPlan.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Removes all the FavoriteAcademicPlans for the user.
   * @param user the username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this._collection.remove({ studentID });
  }

  /**
   * Publish AcademicPlanFavorites. If logged in as ADMIN get all, otherwise only get the AcademicPlanFavorites for the
   * studentID.
   * Also publishes the AcademicPlanFavorites scoreboard.
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
      Meteor.publish(this.publicationNames.scoreboard, function publishAcademicPlanScoreboard() {
        ReactiveAggregate(this, instance._collection, [
          {
            $group: {
              _id: '$academicPlanID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, academicPlanID: 1 } },
        ], { clientCollection: 'AcademicPlanFavoritesScoreboard' });
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
   * Returns the AcademicPlan associated with the FavoriteAcademicPlan with the given instanceID.
   * @param instanceID The id of the AcademicPlanInstance.
   * @returns {Object} The associated AcademicPlan.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getAcademicPlanDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return AcademicPlans.findDoc(instance.academicPlanID);
  }

  /**
   * Returns the AcademicPlan slug for the favorite's corresponding AcademicPlan.
   * @param instanceID The FavoriteAcademicPlan ID.
   * @return {string} The academicPlan slug.
   */
  getAcademicPlanSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return AcademicPlans.findSlugByID(instance.academicPlanID);
  }

  /**
   * Returns the Student profile associated with the FavoriteAcademicPlan with the given instanceID.
   * @param instanceID The ID of the FavoriteAcademicPlan.
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
   * @param instanceID the FavoriteAcademicPlan id.
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
   * Checks semesterID, academicPlanID, and studentID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!AcademicPlans.isDefined(doc.academicPlanID)) {
          problems.push(`Bad academicPlanID: ${doc.academicPlanID}`);
        }
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the FavoriteAcademicPlan docID in a format acceptable to define().
   * @param docID The docID of a FavoriteAcademicPlan.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const academicPlan = AcademicPlans.findSlugByID(doc.academicPlanID);
    const student = Users.getProfile(doc.studentID).username;
    const { retired } = doc;
    return { academicPlan, student, retired };
  }
}

export const FavoriteAcademicPlans = new FavoriteAcademicPlanCollection();
