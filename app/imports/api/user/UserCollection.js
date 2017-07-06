import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
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
   * @returns The docID of the newly created user.
   * @throws { Meteor.Error } If the user exists.
   */
  define({ username, role }) {
    // TODO: not everyone should have the password foo.
    const userID = Accounts.createUser({ username, email: username, password: 'foo' });
    Roles.addUsersToRoles(userID, [role]);
    return userID;
  }

  /**
   * Returns true if user is a defined userID or username.
   * @param user The user.
   * @returns True if user is defined, false otherwise.
   */
  isDefined(user) {
    return (Meteor.users.find({ _id: user })) || (Meteor.users.find({ username: user }));
  }

  /**
   * Returns the userID associated with user, or throws an error if not defined.
   * @param user The user (username or userID).
   * @returns The userID
   * @throws { Meteor.Error } If user is not a defined username or userID.
   */
  getID(user) {
    const userID = (Meteor.users.find({ _id: user })) || (Meteor.users.find({ username: user }));
    if (!userID) {
      throw new Meteor.Error(`Error: user ${user} is not defined.`);
    }
    return userID;
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
   * Returns the profile document associated with user.
   * @param user The username or userID.
   * @returns The profile document.
   * @throws { Meteor.Error } If the document was not found.
   */
  getProfile(user) {
    const userID = this.getID(user);
    const profile = StudentProfiles.hasProfile(userID) || FacultyProfiles.hasProfile(userID)
        || MentorProfiles.hasProfile(userID) || AdvisorProfiles.hasProfile(userID);
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
