import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';

import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { isRole, assertRole } from '/imports/api/role/Role';
import { getTotalICE } from '/imports/api/ice/IceProcessor';
import { Slugs } from '/imports/api/slug/SlugCollection';

/** @module User */

/**
 * Represent a user. Users are students, admins, faculty, and alumni.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class UserCollection extends BaseInstanceCollection {

  /**
   * Creates the User collection.
   */
  constructor() {
    super('User', new SimpleSchema({
      // Required fields
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      username: { type: String },
      email: { type: String, optional: true },
      password: { type: String, optional: true },
      // Optional fields.
      uhID: { type: String, optional: true },
      degreePlanID: { type: SimpleSchema.RegEx.Id, optional: true },
      careerGoalIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
      interestIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
      desiredDegree: { type: String, optional: true },
      picture: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      semesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      level: { type: Number, optional: true },
      stickers: { type: [Number], optional: true },
      website: { type: String, optional: true},
      // username, email, and password are managed in accounts package.
    }));
    // Use Meteor.users as the collection, not the User collection created by BaseCollection.
    this._collection = Meteor.users;
    // TODO: SimpleSchema validation is disabled for now.
    // this._collection.attachSchema(this._schema);
    // The following fields facilitate subscriptions.
    this.publicdata = { fields: { firstName: 1, middleName: 1, lastName: 1, slugID: 1, aboutMe: 1, interestIDs: 1,
      careerGoalIDs: 1, picture: 1, degreePlanID: 0 } };
    this.privatedata = { fields: { roles: 1, emails: 1, degreePlanID: 1, desiredDegree: 1, semesterID: 1 } };
  }

  /**
   * Defines a new User and their required data.
   * @example
   * Users.define({ firstName: 'Joe',
   *                lastName: 'Smith',
   *                slug: 'joesmith',
   *                email: 'smith@hawaii.edu',
   *                role: ROLE.STUDENT,
   *                password: 'foo' });
   * @param { Object } description Object with keys firstName, lastName, slug, email, role, and password.
   * slug must be previously undefined. role must be a defined role.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({ firstName, lastName, slug, email, role, password }) {
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    let userID;
    // Define the user in accounts package.
    if (password) {
      userID = Accounts.createUser({ username: slug, email, password });
    } else {
      const result = { id: slug };
      const options = { profile: { name: slug } };
      const casReturn = Accounts.updateOrCreateUserFromExternalService('cas', result, options);
      userID = casReturn.userId;
    }
    Meteor.users.update(userID, { $set: { username: slug, firstName, lastName, slugID, email } });

    // Define the role if valid.
    if (!isRole(role)) {
      throw new Meteor.Error(`Role ${role} is not a valid role name.`);
    }
    Roles.addUsersToRoles(userID, [role]);

    // Update the Slug with the userID.
    Slugs.updateEntityID(slugID, userID);

    return userID;
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
   * @throws { Meteor.Error } if the user or their slug is not defined, or if they are referenced in Opportunities.
   */
  removeIt(user) {
    // TODO: check to see user is not defined in any opportunities.
    // TODO: delete degreeplan if present.
    super.removeIt(user);
  }

  /**
   * Remove all users with the associated role.
   * @param role The role.
   * @throws { Meteor.Error } If the role is not a defined role.
   */
  removeAllWithRole(role) {
    assertRole(role);
    this.find().forEach(user => { if (Roles.userIsInRole(user._id, [role])) { this.removeIt(user._id); } });
  }

  /**
   * Asserts that the passed user has the given role.
   * @param userID The user.
   * @param role The role.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  assertInRole(userID, role) {
    this.assertDefined(userID);
    if (Array.isArray(role)) {
      role.forEach((r) => {
        assertRole(r);
      });
    } else {
      assertRole(role);
    }
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
    if (!_.isString(uhID)) {
      throw new Meteor.Error(`${uhID} is not a string.`);
    }
    this._collection.update(userID, { $set: { uhID } });
  }

  /**
   * Returns the user doc associated with the given uhID.
   * @param uhID the user's UH ID.
   * @returns Object the user doc associated with the given uhID.
   */
  getUserFromUhId(uhID) {
    const users = this._collection.find({ uhID }).fetch();
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }

  /**
   * Returns the user doc associated with the given username.
   * @param username the username.
   * @returns Object the user doc associated with the given username.
   */
  getUserFromUsername(username) {
    const users = this._collection.find({ username }).fetch();
    if (users.length > 0) {
      return users[0];
    }
    return null;
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
    if (!_.isString(email)) {
      throw new Meteor.Error(`${email} is not a string.`);
    }
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
    if (!_.isString(website)) {
      throw new Meteor.Error(`${website} is not a string.`);
    }
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
    if (!_.isString(picture)) {
      throw new Meteor.Error(`${picture} is not a string.`);
    }
    this._collection.update(userID, { $set: { picture } });
  }

  /**
   * Updates userID with AboutMe string.
   * @param userID The userID.
   * @param aboutMe The aboutMe string in markdown format.
   * @throws {Meteor.Error} If userID is not a userID, or if aboutMe is not a string.
   */
  setAboutMe(userID, aboutMe) {
    this.assertDefined(userID);
    if (!_.isString(aboutMe)) {
      throw new Meteor.Error(`${aboutMe} is not a string.`);
    }
    this._collection.update(userID, { $set: { aboutMe } });
  }

  /**
   * Updates userID with desiredDegree string.
   * @param userID The userID.
   * @param desiredDegree The desired degree string.
   * @throws {Meteor.Error} If userID is not a userID, or if desiredDegree is not a string.
   */
  setDesiredDegree(userID, desiredDegree) {
    this.assertDefined(userID);
    if (!_.isString(desiredDegree)) {
      throw new Meteor.Error(`${desiredDegree} is not a string.`);
    }
    this._collection.update(userID, { $set: { desiredDegree } });
  }

  /**
   * Updates userID with a graduation SemesterID.
   * @param userID The userID.
   * @param semesterID The semesterID.
   * @throws {Meteor.Error} If userID is not a userID, or if semesterID is not a semesterID.
   */
  setSemesterId(userID, semesterID) {
    this.assertDefined(userID);
    Semesters.assertSemester(semesterID);
    this._collection.update(userID, { $set: { semesterID } });
  }

  /**
   * Updates userID's level.
   * @param userID The userID.
   * @param level The new level.
   */
  setLevel(userID, level) {
    this.assertDefined(userID);
    if (!_.isNumber(level)) {
      throw new Meteor.Error(`${level} is not a number.`);
    } else if (level < 0 || level > 6) {
      throw new Meteor.Error(`${level} is out of bounds.`);
    }
    this._collection.update(userID, { $set: { level } });
  }

  /**
   * Updates userID with an array of level stickers.
   * @param userID The userID.
   * @param stickers A list of levels.
   * @throws {Meteor.Error} If userID is not a userID, or if stickers is not a list of numbers.
   */
  setStickers(userID, stickers) {
    this.assertDefined(userID);
    let max = 0;
    if (!_.isArray(stickers)) {
      throw new Meteor.Error(`${stickers} is not an array.`);
    } else {
      stickers.forEach((s) => {
        if (!_.isNumber(s)) {
          throw new Meteor.Error(`${s} is not a number.`);
        } else if (s > max) {
          max = s;
        }
      });
    }
    this._collection.update(userID, { $set: { stickers } });
    this.setLevel(userID, max);
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
}

/**
 * Provides the singleton instance of this class to other entities.
 */
export const Users = new UserCollection();

