import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { ROLE, isRole, assertRole } from '/imports/api/role/Role';
import { getTotalICE, getProjectedICE, getEarnedICE } from '/imports/api/ice/IceProcessor';
import { Slugs } from '/imports/api/slug/SlugCollection';

/** @module User */

/**
 * Represent a user. Users have roles: admin, advisor, alumni, faculty, student, mentor.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class UserCollection extends BaseInstanceCollection {

  /**
   * Creates the User collection.
   */
  constructor() {
    super('User', new SimpleSchema({
      // Required field
      username: { type: String },
      // Everything else is optional, schema-wise.
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      email: { type: String, optional: true },
      password: { type: String, optional: true },
      uhID: { type: String, optional: true },
      careerGoalIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
      interestIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
      // TODO: Store desiredDegree as its docID, not the slug.
      desiredDegree: { type: String, optional: true },
      picture: { type: String, optional: true },
      level: { type: Number, optional: true },
      website: { type: String, optional: true },
    }));
    // Use Meteor.users as the collection, not the User collection created by BaseCollection.
    this._collection = Meteor.users;

    // TODO: Enable simpleschema validation.
    // this._collection.attachSchema(this._schema);

    this._publicData = {
      fields: {
        firstName: 1,
        lastName: 1,
        slugID: 1,
        interestIDs: 1,
        careerGoalIDs: 1,
        picture: 1,
        roles: 1,
        username: 1,
        desiredDegree: 1,
        website: 1,
        emails: 1,
      },
    };
    this._privateData = { fields: { uhID: 1 } };
    // Define _allData as the union of public and private data.
    this._allData = { fields: {} };
    _.defaultsDeep(this._allData, this._publicData, this._privateData);
  }

  /**
   * Defines a new User.
   * @example
   * Users.define({ firstName: 'Joe',
   *                lastName: 'Smith',
   *                slug: 'joesmith',
   *                email: 'smith@hawaii.edu',
   *                role: ROLE.STUDENT,
   *                password: 'foo',
   *                // following fields are optional.
   *                uhID: '12345678',
   *                picture: 'http://johnson.github.io/images/profile.jpg',
   *                website: 'http://johnson.github.io/',
   *                interests: ['software-engineering'],
   *                careerGoals: ['application-developer'],
   *                desiredDegree: 'bs-cs',
   *               });
   * @param { Object } description Object with required keys firstName, lastName, slug, email, role, and password.
   * slug must be previously undefined. role must be a defined role.
   * picture, website, interests, careerGoals, and desiredDegree are optional.
   * desiredDegree must be a DesiredDegree slug or docID.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({
      firstName, lastName, slug, email, role, password, picture, interests, careerGoals, desiredDegree,
      website, uhID,
  }) {
    // Users can only be defined on the server side.
    if (Meteor.isServer) {
      // Get SlugID, throw error if found.
      const slugID = Slugs.define({ name: slug, entityName: this.getType() });
      // Make sure role is supplied and is valid.
      if (!isRole(role)) {
        throw new Meteor.Error(`Role ${role} is not a valid role name.`);
      }
      const interestIDs = Interests.getIDs(interests);
      const careerGoalIDs = CareerGoals.getIDs(careerGoals);
      // if (desiredDegree && !DesiredDegrees.isDefined(desiredDegree)) {
      //   throw new Meteor.Error(`Desired degree slug ${desiredDegree} is not defined.`);
      // }
      desiredDegree = null; // eslint-disable-line
      // Now define the user.
      let userID;
      if (password) {
        userID = Accounts.createUser({ username: slug, email, password });
      } else {
        const result = { id: slug };
        const options = { profile: { name: slug } };
        const casReturn = Accounts.updateOrCreateUserFromExternalService('cas', result, options);
        userID = casReturn.userId;
      }

      // Now that we have a user, update fields.
      Meteor.users.update(userID, {
        $set: {
          username: slug, firstName, lastName, slugID, email, picture, website,
          desiredDegree, interestIDs, careerGoalIDs, uhID, level: 1,
        },
      });

      Roles.addUsersToRoles(userID, [role]);

      // Update the Slug with the userID.
      Slugs.updateEntityID(slugID, userID);

      return userID;
    }
    return null;
  }

  /**
   * Returns the full name for the given userID.
   * @param userID the id of the user.
   * @returns {string} The user's full name.
   * @throws {Meteor.Error} If userID is not a valid ID.
   */
  getFullName(userID) {
    this.assertDefined(userID);
    const user = this._collection.findOne({ _id: userID });
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Returns the user's roles.
   * @param userID the user's ID.
   * @returns {number|roles|{$in}|update.$addToSet.roles|{$each}|Array|String|*}
   */
  getRoles(userID) {
    this.assertDefined(userID);
    const user = this._collection.findOne({ _id: userID });
    return user.roles;
  }

  /**
   * Removes the user and their associated DegreePlan (if present) and their Slug.
   * @param user The object or docID representing this user.
   * @throws { Meteor.Error } if the user or their slug is not defined, or if the user has remaining
   * opportunity or course instances.
   */
  removeIt(user) {
    const docID = this.findDoc(user)._id;
    const courseInstanceCount = CourseInstances.find({ studentID: docID }).count();
    const opportunityInstanceCount = OpportunityInstances.find({ studentID: docID }).count();
    if ((courseInstanceCount + opportunityInstanceCount) === 0) {
      super.removeIt(user);
    } else {
      throw new Meteor.Error(`Attempt to remove ${user} while course or opportunity instances remain.`);
    }
  }

  /**
   * Remove all users with the associated role.
   * @param role The role.
   * @throws { Meteor.Error } If the role is not a defined role.
   */
  removeAllWithRole(role) {
    assertRole(role);
    this.find().forEach(user => {
      if (Roles.userIsInRole(user._id, [role])) {
        this.removeIt(user._id);
      }
    });
  }

  /**
   * Asserts that the passed user has one of the given roles.
   * @param userID The user.
   * @param role The role or an array of roles.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  assertInRole(userID, role) {
    this.assertDefined(userID);
    assertRole(role);
    if (!Roles.userIsInRole(userID, role)) {
      throw new Meteor.Error(`${userID} (${this.findDoc(userID).firstName}) is not in role ${role}.`);
    }
  }

  /**
   * @returns {String | undefined} The user's email as a string, or undefined if not published.
   * @param userID The userID.
   * @throws {Meteor.Error} If userID is not a user ID.
   */
  getEmail(userID) {
    this.assertDefined(userID);
    const docID = this.findDoc(userID);
    return (docID.emails) ? docID.emails[0].address : undefined;
  }

  /**
   * Updates userID with UH ID.
   * @param userID The userID.
   * @param uhID The UH ID number, as a string.
   * @throws {Meteor.Error} If userID is not a userID, or if uhID is not a string.
   */
  setUhId(userID, uhID) {
    this.assertDefined(userID);
    check(uhID, String);
    this._collection.update(userID, { $set: { uhID } });
  }

  /**
   * Returns the user doc associated with the given uhID.
   * @param uhID the user's UH ID.
   * @returns Object the user doc associated with the given uhID or null if not found.
   */
  getUserFromUhId(uhID) {
    check(uhID, String);
    return this._collection.findOne({ uhID });
  }

  /**
   * Returns the user doc associated with the given username.
   * @param username the username.
   * @returns Object the user doc associated with the given username or null if not found.
   */
  getUserFromUsername(username) {
    check(username, String);
    return this._collection.findOne({ username });
  }

  /**
   * Updates userID with an array of careerGoalIDs.
   * @param userID The userID.
   * @param careerGoalIDs A list of careerGoalIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if careerGoalIDs is not a list of careerGoalID.
   */
  setCareerGoalIds(userID, careerGoalIDs) {
    this.assertDefined(userID);
    CareerGoals.assertAllDefined(careerGoalIDs);
    this._collection.update(userID, { $set: { careerGoalIDs } });
  }

  /**
   * Updates email with new email address.
   * @param userID The userID.
   * @param email The user's email as a string.
   * @throws {Meteor.Error} If userID is not a userID
   */
  setEmail(userID, email) {
    this.assertDefined(userID);
    check(email, String);
    this._collection.update(userID, { $set: { email } });
  }

  /**
   * Updates website with new website address.
   * @param userID The userID.
   * @param email The user's website as a string.
   * @throws {Meteor.Error} If userID is not a userID
   */
  setWebsite(userID, website) {
    this.assertDefined(userID);
    check(website, String);
    this._collection.update(userID, { $set: { website } });
  }

  /**
   * Updates userID with an array of interestIDs.
   * @param userID The userID.
   * @param interestIDs A list of interestIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if interestIDs is not a list of interestID.
   */
  setInterestIds(userID, interestIDs) {
    this.assertDefined(userID);
    Interests.assertAllDefined(interestIDs);
    this._collection.update(userID, { $set: { interestIDs } });
  }

  /**
   * Updates userID with picture.
   * @param userID The userID.
   * @param picture The user's picture as a URL string.
   * @throws {Meteor.Error} If userID is not a userID, or if picture is not a string.
   */
  setPicture(userID, picture) {
    this.assertDefined(userID);
    check(picture, String);
    this._collection.update(userID, { $set: { picture } });
  }

  /**
   * Updates userID with desiredDegree string.
   * @param userID The userID.
   * @param desiredDegree The desired degree.
   * @throws {Meteor.Error} If userID is not a userID, or if desiredDegree is not defined.
   */
  setDesiredDegree(userID, desiredDegree) {
    this.assertDefined(userID);
    check(desiredDegree, String);
    if (!DesiredDegrees.isDefined(desiredDegree)) {
      throw new Meteor.Error(`Desired degree ${desiredDegree} is not defined.`);
    }
    this._collection.update(userID, { $set: { desiredDegree } });
  }

  /**
   * Updates userID's level.
   * @param userID The userID.
   * @param level The new level.
   */
  setLevel(userID, level) {
    this.assertDefined(userID);
    check(level, Number);
    this._collection.update(userID, { $set: { level } });
  }

  /**
   * Returns an ICE object with the total of verified course and opportunity instance ICE values.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getTotalICE(studentID) {
    this.assertDefined(studentID);
    const courseDocs = CourseInstances.find({ studentID }).fetch();
    const oppDocs = OpportunityInstances.find({ studentID }).fetch();
    return getTotalICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an ICE object with the total earned course and opportunity ICE values.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getEarnedICE(studentID) {
    this.assertDefined(studentID);
    const courseDocs = CourseInstances.find({ studentID }).fetch();
    const oppDocs = OpportunityInstances.find({ studentID }).fetch();
    return getEarnedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an ICE object with the total projected course and opportunity ICE values.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getProjectedICE(studentID) {
    this.assertDefined(studentID);
    const courseDocs = CourseInstances.find({ studentID }).fetch();
    const oppDocs = OpportunityInstances.find({ studentID }).fetch();
    return getProjectedICE(courseDocs.concat(oppDocs));
  }

  /* eslint class-methods-use-this: "off" */

  /**
   * Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.
   * @param studentID The studentID.
   */
  getCourseIDs(studentID) {
    const courseInstanceDocs = CourseInstances.find({ studentID }).fetch();
    const courseIDs = courseInstanceDocs.map((doc) => doc.courseID);
    return _.uniq(courseIDs);
  }

  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, function () {
        const fields = (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) ? this._allData : this._publicData;
        return Meteor.users.find({}, fields);
      });
    }
  }
}

/**
 * Provides the singleton instance of this class to other entities.
 */
export const Users = new UserCollection();

