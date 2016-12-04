import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { ROLE } from '/imports/api/role/Role';

/** @module User */

/**
 * Represent a valid user. Users must be apporoved befor they can be created.
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
    if (!lodash.isString(username)) {
      throw new Meteor.Error(`${username} is not a string.`);
    }
    return this._collection.insert({ username });
  }

  /**
   * Depending on the logged in user publish only their CourseInstances. If
   * the user is in the Role.ADMIN then publish all CourseInstances. If the
   * system is in mockup mode publish all CourseInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return null;
      });
    }
  }


}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const ValidUserAccounts = new ValidUserAccountCollection();
