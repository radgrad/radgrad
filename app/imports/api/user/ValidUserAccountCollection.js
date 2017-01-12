import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { ROLE } from '/imports/api/role/Role';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';

/** @module User */

// TODO: Is there a way we can avoid the need for this collection? Can't we just check onLogin that the account exists?

/**
 * Represent a valid user. Users must be approved before they can be created.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class ValidUserAccountCollection extends BaseInstanceCollection {
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
   * Publish the set of valid users only if the current logged in user is an Admin or Advisor.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return null;
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
radgradCollections.push(ValidUserAccounts);
