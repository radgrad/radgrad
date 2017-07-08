import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { ROLE } from '../role/Role';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { StudentProfiles } from './StudentProfileCollection';
import { MentorProfiles } from './MentorProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/** @module api/user/UserCollection */

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
 */
class UserCollection {

  /**
   * Define a new user, which means creating an entry in Meteor.Accounts.
   * This is called in the various Profile define() methods.
   * @param username The username to be defined (must be an email address).
   * @param role The role.
   * @returns { String } The docID of the newly created user.
   * @throws { Meteor.Error } If the user exists.
   */
  define({ username, role }) {
    // TODO: not everyone should have the password foo.
    const userID = Accounts.createUser({ username, email: username, password: 'foo' });
    Roles.addUsersToRoles(userID, [role]);
    return userID;
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
      throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`);
    }
  }

  /**
   * Returns true if user is a defined userID or username.
   * @param user The user.
   * @returns { boolean } True if user is defined, false otherwise.
   */
  isDefined(user) {
    return (Meteor.users.find({ _id: user })) || (Meteor.users.find({ username: user }));
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
      throw new Meteor.Error(`Error: user ${user} is not defined.`);
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
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${users} to an ID.`);
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
   * @param user The username or userID.
   * @returns { Object | Null } The profile document or null if not found.
   */
  hasProfile(user) {
    const userID = this.getID(user);
    return StudentProfiles.hasProfile(userID) || FacultyProfiles.hasProfile(userID)
        || MentorProfiles.hasProfile(userID) || AdvisorProfiles.hasProfile(userID);
  }

  /**
   * Returns the profile document associated with user.
   * @param user The username or userID.
   * @returns { Object } The profile document.
   * @throws { Meteor.Error } If the document was not found.
   */
  getProfile(user) {
    const profile = this.hasProfile(user);
    if (!profile) {
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return profile;
  }

  /**
   * Removes the user, their profile, and any associated "private" entities (Feeds, CourseInstances, etc.).
   * @param user The username or docID associated with this user.
   * @throws { Meteor.Error } if the username is not defined, or if the user is referenced by other "public" entities
   * (Reviews, Opportunities, etc.)
   */
  removeIt(user) {
    const userID = this.getID(user);
    if (!this.isReferenced(userID)) {
      // Automatically remove references to user from other collections that are "private" to this user.
      _.forEach([Feeds, CourseInstances, OpportunityInstances, AcademicYearInstances, FeedbackInstances, AdvisorLogs,
        VerificationRequests], collection => collection.removeUser(user));
      // Now remove user profile. We don't know which collection it's in, so try all of them.
      if (AdvisorProfiles.hasProfile(user)) {
        AdvisorProfiles.removeIt(AdvisorProfiles.getProfile(user)._id);
      }
      if (StudentProfiles.hasProfile(user)) {
        StudentProfiles.removeIt(StudentProfiles.getProfile(user)._id);
      }
      if (MentorProfiles.hasProfile(user)) {
        MentorProfiles.removeIt(MentorProfiles.getProfile(user)._id);
      }
      if (FacultyProfiles.hasProfile(user)) {
        FacultyProfiles.removeIt(FacultyProfiles.getProfile(user)._id);
      }
      // Now remove the user from Meteor users.
      Meteor.users.remove(userID);
    } else {
      throw new Meteor.Error(`Attempt to remove ${user} while references to public entities remain.`);
    }
  }

  /**
   * Removes all elements of this collection.
   * This is implemented by mapping through all elements because mini-mongo does not implement the remove operation.
   * So this approach can be used on both client and server side.
   * removeAll should only used for testing purposes, so it doesn't need to be efficient.
   */
  removeAll() {
    const users = Meteor.users.find().fetch();
    _.forEach(users, (i) => {
      this.removeIt(i._id);
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
    throw new Meteor.Error(`Unknown role: ${role}`);
  }

  /**
   * Iterates through all Profile collections, and returns an array of profiles that satisfy filter.
   * @param filter A function that accepts a profile a document and returns truthy if that document should be included
   * in the returned array.
   * @returns {Array} An array of profile documents from across all the Profile collections satisfying filter.
   */
  filterProfiles(filter) {
    const profiles = [];
    StudentProfiles.find().forEach((profile) => { if (filter(profile)) { profiles.push(profile); } });
    AdvisorProfiles.find().forEach((profile) => { if (filter(profile)) { profiles.push(profile); } });
    FacultyProfiles.find().forEach((profile) => { if (filter(profile)) { profiles.push(profile); } });
    MentorProfiles.find().forEach((profile) => { if (filter(profile)) { profiles.push(profile); } });
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
    StudentProfiles.find().forEach((profile) => { if (predicate(profile)) { exists = true; } });
    if (exists) {
      return true;
    }
    AdvisorProfiles.find().forEach((profile) => { if (predicate(profile)) { exists = true; } });
    if (exists) {
      return true;
    }
    FacultyProfiles.find().forEach((profile) => { if (predicate(profile)) { exists = true; } });
    if (exists) {
      return true;
    }
    MentorProfiles.find().forEach((profile) => { if (predicate(profile)) { exists = true; } });
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
    let interestIDs = profile.interestIDs;
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
      Meteor.publish('UserCollection', function publish() {
        return Meteor.users.find({}, { fields: { username: 1 } });
      });
    }
  }
}

/**
 * Provides the singleton instance of this class to other entities.
 */
export const Users = new UserCollection();
