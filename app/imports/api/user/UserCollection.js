import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../career/CareerGoalCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Reviews } from '../review/ReviewCollection';
import { ROLE } from '../role/Role';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { StudentProfiles } from './StudentProfileCollection';
import { MentorProfiles } from './MentorProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';

/* eslint-disable class-methods-use-this */

/**
 * Represents a user, which is someone who has a Meteor account.
 *
 * Users are defined when the various Profile collections are initialized, so the User collection is the union
 * of Students, Faculty, Advisors, and Mentors, plus the single Admin account who also has a Meteor account.
 *
 * Note that this collection does not extend any of our Base collections, because it has a very limited API
 * which should be used by clients to access the various Profile collections.
 *
 * It is not saved out or restored when the DB is dumped. It is not listed in RadGrad.collections.
 *
 * Clients provide a "user" as a parameter, which is either the username (i.e. email) or userID.
 * @memberOf api/user
 */
class UserCollection {
  constructor() {
    this._collectionName = 'UserCollection';
  }

  /**
   * Define a new user, which means creating an entry in Meteor.Accounts.
   * This is called in the various Profile define() methods.
   * @param username The username to be defined (must be an email address).
   * @param role The role.
   * @returns { String } The docID of the newly created user.
   * @throws { Meteor.Error } If the user exists.
   */
  define({ username, role }) {
    if (Meteor.isServer) {
      if ((role === ROLE.STUDENT) || (role === ROLE.FACULTY) || (role === ROLE.ADVISOR)) {
        // Define this user with a CAS login.
        const userWithoutHost = username.split('@')[0];
        const result = { id: userWithoutHost };
        const options = { profile: { name: userWithoutHost } };
        const casReturn = Accounts.updateOrCreateUserFromExternalService('cas', result, options);
        const userID = casReturn.userId;
        Meteor.users.update(userID, { $set: { username } });
        // Meteor.users.find().fetch().map(user => console.log('  ', JSON.stringify(user)));
        Roles.addUsersToRoles(userID, [role]);
        return userID;
      }
      // Otherwise define this user with a Meteor login and randomly generated password.
      const password = this._generateRandomPassword();
      console.log(`Defining user ${username} with password ${password}`);
      const userID = Accounts.createUser({ username, email: username, password });
      Roles.addUsersToRoles(userID, [role]);
      return userID;
    }
    return undefined;
  }

  /**
   * Generate a random password.
   * Adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   * @returns {string} The password.
   * @private
   */
  _generateRandomPassword() {
    let password = '';
    const maxLength = 10;
    const minLength = 6;
    const passwordLength = Math.floor(Math.random() * (maxLength - (minLength + 1))) + minLength;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < passwordLength; i++) { // eslint-disable-line no-plusplus
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
  }

  /**
   * Asserts that the passed user has the specified role.
   * @param user The user (username or userID).
   * @param role The role or an array of roles.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  assertInRole(user, role) {
    const userID = this.getID(user);
    if (!Roles.userIsInRole(userID, role)) {
      throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`,
        '', Error().stack);
    }
  }

  /**
   * Returns true if user is a defined userID or username.
   * @param user The user.
   * @returns { boolean } True if user is defined, false otherwise.
   */
  isDefined(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    if (!userDoc) {
      return false;
    }
    return true;
  }

  /**
   * Returns the userID associated with user, or throws an error if not defined.
   * @param user The user (username or userID).
   * @returns { String } The userID
   * @throws { Meteor.Error } If user is not a defined username or userID.
   */
  getID(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    if (!userDoc) {
      console.error('Error: user is not defined: ', user);
      // console.trace(`User is not defined ${user}`);
      throw new Meteor.Error(`Error: user '${user}' is not defined.`, 'Not Defined', Error().stack);
    }
    return userDoc._id;
  }

  /**
   * Returns the userIDs associated with users, or throws an error if any cannot be found.
   * @param { String[] } users An array of valid users.
   * @returns { String[] } The docIDs associated with users.
   * @throws { Meteor.Error } If any instance is not a user.
   */
  getIDs(users) {
    let ids;
    try {
      ids = (users) ? users.map((instance) => this.getID(instance)) : [];
    } catch (err) {
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${users} to an ID.`,
        'Not Defined', Error().stack);
    }
    return ids;
  }

  /**
   * Returns the full name for the given user.
   * @param user the user (username or ID).
   * @returns {string} The user's full name.
   * @throws {Meteor.Error} If user is not a valid user.
   */
  getFullName(user) {
    if (user === '') {
      console.trace('getFullName on empty string');
    }
    const profile = this.getProfile(user);
    return `${profile.firstName} ${profile.lastName}`;
  }

  /**
   * Returns true if user is referenced by other "public" entities. Specifically:
   *   * The user is a student and has published a review.
   *   * The user is a mentor and has published an answer.
   *   * The user is a student and has published a question.
   *   * The user is a faculty member as has sponsored an opportunity.
   * Used to determine if this user can be deleted.
   * Note this doesn't test for references to CourseInstances, etc. These are "private" and will be deleted
   * implicitly if this user is deleted.
   * @param user The username or userID.
   * @returns {boolean} True if this user is referenced "publicly" elsewhere.
   * @throws { Meteor.Error } If the username is not defined.
   */
  isReferenced(user) {
    const userID = this.getID(user);
    const hasReviews = Reviews.find({ studentID: userID }).count();
    const hasAnswers = MentorAnswers.find({ mentorID: userID }).count();
    const hasQuestions = MentorQuestions.find({ studentID: userID }).count();
    const hasOpportunities = Opportunities.find({ sponsorID: userID }).count();
    return (hasReviews || hasAnswers || hasQuestions || hasOpportunities);
  }

  /**
   * Returns the profile document associated with user, or null if not found.
   * Assumes that the user is defined. If not, throws an error.
   * @param user The username or userID.
   * @returns { Object | Null } The profile document or null if not found.
   */
  hasProfile(user) {
    const userID = this.getID(user);
    const adminID = this._getAdminID();
    if (userID === adminID) {
      return this._getAdminProfile();
    }
    return StudentProfiles.hasProfile(userID) || FacultyProfiles.hasProfile(userID)
        || MentorProfiles.hasProfile(userID) || AdvisorProfiles.hasProfile(userID);
  }

  /**
   * Returns the profile associated with the passed username, or null if not found.
   * Does not check to see if the user is defined, which makes this method useful for Accounts.validateNewUser.
   * @param username A username.
   * @returns The profile document, or null if not found.
   */
  findProfileFromUsername(username) {
    return StudentProfiles.findByUsername(username) || FacultyProfiles.findByUsername(username)
        || MentorProfiles.findByUsername(username) || AdvisorProfiles.findByUsername(username);
  }

  count() {
    return StudentProfiles.count() + FacultyProfiles.count() + MentorProfiles.count() + AdvisorProfiles.count();
  }

  /**
   * Returns the admin username from the settings file, or 'radgrad@hawaii.edu' (for testing purposes).
   * @returns {string} The admin username.
   * @private
   */
  _adminUsername() {
    return (_.has(Meteor, 'settings.public.admin.username')) ? Meteor.settings.public.admin.username
      : 'radgrad@hawaii.edu';
  }

  /**
   * Returns the admin userID.
   * @private
   */
  _getAdminID() {
    const username = this._adminUsername();
    let adminDoc = Meteor.users.findOne({ username });
    // The admin is user is not created by the startup code during unit testing.
    // This is kind of a hack to implicitly define the admin user during unit tests.
    if (!adminDoc && Meteor.isServer && Meteor.isTest) {
      const userID = Accounts.createUser({ username, email: username, password: 'foo' });
      Roles.addUsersToRoles(userID, ROLE.ADMIN);
      adminDoc = Meteor.users.findOne({ username });
    }
    return adminDoc._id;
  }

  /**
   * There is only one admin and there is no collection for them. (This might be a mistake).
   * Anyway, this function returns an object that serves as their profile.
   * @returns The admin profile.
   * @private
   */
  _getAdminProfile() {
    const adminUsername = this._adminUsername();
    const adminID = Meteor.users.findOne({ username: adminUsername })._id;
    return {
      username: adminUsername, firstName: 'RadGrad', lastName: 'Admin', role: ROLE.ADMIN, userID: adminID,
    };
  }

  /**
   * Returns the profile document associated with user.
   * @param user The username or userID.
   * @returns { Object } The profile document.
   * @throws { Meteor.Error } If the document was not found.
   */
  getProfile(user) {
    // First, let's check to see if user is actually a profile (or looks like one). If so, just return it.
    if (_.isObject(user) && user.firstName && user.lastName && user.role) {
      return user;
    }
    const profile = this.hasProfile(user);
    if (!profile) {
      console.log(`No profile found for user ${user}`);
      throw new Meteor.Error(`No profile found for user ${user}`, '', Error().stack);
    }
    return profile;
  }

  /**
   * DO NOT USE.
   * @throws { Meteor.Error } Should not be used. Should remove the profile for the user.
   */
  removeIt(user) {
    const userID = this.getID(user);
    if (!this.isReferenced(userID)) {
      Meteor.users.remove(userID);
    } else {
      throw new Meteor.Error(`Attempt to remove ${user} while references to public entities remain.`,
        '', Error().stack);
    }
  }

  /**
   * Removes all users except for the admin user.
   * This is implemented by mapping through all elements because mini-mongo does not implement the remove operation.
   * So this approach can be used on both client and server side.
   * removeAll should only used for testing purposes, so it doesn't need to be efficient.
   */
  removeAll() {
    const users = Meteor.users.find().fetch();
    _.forEach(users, (i) => {
      if (!(this._adminUsername() === i.username)) {
        this.removeIt(i._id);
      }
    });
  }

  /**
   * Runs find on all the Profile collections, fetches the associated documents, and returns an array containing all
   * of the matches.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns { Array } An array of documents matching the selector and options.
   */
  findProfiles(selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    let profiles = [];
    profiles = profiles.concat(StudentProfiles.find(theSelector, options).fetch());
    profiles = profiles.concat(AdvisorProfiles.find(theSelector, options).fetch());
    profiles = profiles.concat(FacultyProfiles.find(theSelector, options).fetch());
    profiles = profiles.concat(MentorProfiles.find(theSelector, options).fetch());
    return profiles;
  }

  /**
   * Runs find on all the Profile collections, fetches the associated documents, and returns an array containing all
   * of the matches.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns { Array } An array of documents matching the selector and options.
   */
  findProfilesWithRole(role, selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    if (role === ROLE.STUDENT) {
      theSelector.isAlumni = false;
      return StudentProfiles.find(theSelector, options).fetch();
    }
    if (role === ROLE.ALUMNI) {
      theSelector.isAlumni = true;
      return StudentProfiles.find(theSelector, options).fetch();
    }
    if (role === ROLE.ADVISOR) {
      return AdvisorProfiles.find(theSelector, options).fetch();
    }
    if (role === ROLE.FACULTY) {
      return FacultyProfiles.find(theSelector, options).fetch();
    }
    if (role === ROLE.MENTOR) {
      return MentorProfiles.find(theSelector, options).fetch();
    }
    if (role === ROLE.ADMIN) {
      return this._getAdminID();
    }
    console.log(`Unknown role: ${role}`);
    throw new Meteor.Error(`Unknown role: ${role}`, '', Error().stack);
  }

  /**
   * Iterates through all Profile collections, and returns an array of profiles that satisfy filter.
   * @param filter A function that accepts a profile a document and returns truthy if that document should be included
   * in the returned array.
   * @returns {Array} An array of profile documents from across all the Profile collections satisfying filter.
   */
  filterProfiles(filter) {
    const profiles = [];
    StudentProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    AdvisorProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    FacultyProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    MentorProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    return profiles;
  }

  /**
   * Returns true if at least one profile satisfies the passed predicate.
   * @param predicate A function which can be applied to any document in any profile collection and returns true
   * or false.
   * @returns {boolean} True if at least one document satisfies the predicate.
   */
  someProfiles(predicate) {
    let exists = false;
    StudentProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    AdvisorProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    FacultyProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    MentorProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    return false;
  }

  /**
   * Returns the user's interests as IDs. It is a union of interestIDs and careerGoal interestIDs.
   * @param user The username or userID.
   * @returns {Array} An array of interestIDs.
   */
  getInterestIDs(user) {
    const profile = this.getProfile(user);
    let { interestIDs } = profile;
    _.forEach(profile.careerGoalIDs, (careerGoalID) => {
      const goal = CareerGoals.findDoc(careerGoalID);
      interestIDs = _.union(interestIDs, goal.interestIDs);
    });
    return interestIDs;
  }

  /**
   * Returns the user's interest IDs in an Array with two sub-arrays. The first sub-array is the interest IDs that the
   * User selected. The second sub-array is the interestIDs from the user's career goals that are not already present
   * in the first subarray.
   * @param user The username or userID.
   * @returns { Array } An array with two subarrays, each containing interestIDs.
   */
  getInterestIDsByType(user) {
    const profile = this.getProfile(user);
    const interestIDs = [];
    interestIDs.push(profile.interestIDs);
    let careerInterestIDs = [];
    _.forEach(profile.careerGoalIDs, (goalID) => {
      const goal = CareerGoals.findDoc(goalID);
      careerInterestIDs = _.union(careerInterestIDs, goal.interestIDs);
    });
    careerInterestIDs = _.difference(careerInterestIDs, profile.interestIDs);
    interestIDs.push(careerInterestIDs);
    return interestIDs;
  }

  /**
   * Publish the username field for all users.
   */
  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, () => Meteor.users.find({}, {
        fields: {
          username: 1,
          roles: 1,
          status: 1,
        },
      }));
    }
  }

  /**
   * Default subscription method for entities.
   * It subscribes to the entire collection.
   */
  subscribe() {
    if (Meteor.isClient) {
      Meteor.subscribe(this._collectionName);
    }
  }

  /**
   * Return the publication name.
   * @returns { String } The publication name, as a string.
   */
  getPublicationName() {
    return this._collectionName;
  }
}

/**
 * Provides the singleton instance of this class to other entities.
 * @type {api/user.UserCollection}
 * @memberOf api/user
 */
export const Users = new UserCollection();
