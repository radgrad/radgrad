import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';


/** @module api/user/ValidUserAccountCollection */

// TODO Eliminate this collection once we have profiles for each type of user. If no profile, no login.

/**
 * Represent a valid user. Users must be approved before they can be created.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class ValidUserAccountCollection extends BaseCollection {
  /**
   * Creates the Valid User Account collection.
   */
  constructor() {
    super('ValidUserAccount', new SimpleSchema({
      username: { type: String },
    }));
  }

  /**
   * Defines a valid user account.
   * @param username The username.
   * @returns {any} The id of the valid user account.
   */
  define({ username }) {
    check(username, String);
    return this._collection.insert({ username });
  }

  /**
   * Removes the ValidUserAccount entry referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const username = Users.findDoc(user).username;
    this._collection.remove({ username });
  }

  /**
   * Publish the set of valid users only if the current logged in user is an Admin or Advisor.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    return [];
  }

  /**
   * Returns an object representing the ValidUserAccount docID in a format acceptable to define().
   * @param docID The docID of an ValidUserAccount.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    return { username };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const ValidUserAccounts = new ValidUserAccountCollection();
