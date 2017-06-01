import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Users } from './UserCollection';
import { ROLE } from '../role/Role';

/** @module api/user/UserCollectionMethods */

// TODO: Centralize schemas. Currently three: (1) here, (2) admin UI, (3) UserCollection definition.
/**
 * The Users define validated method.
 */
export const defineUserMethod = new ValidatedMethod({
  name: 'Users.define',
  validate: null,
  run(userDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Users.');
    }
    return Users.define(userDefn);
  },
});

/**
 * The Users update validated method.
 */
export const updateUserMethod = new ValidatedMethod({
  name: 'Users.update',
  validate: null,
  run(userDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Users.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Users.');
    }
    return Users.update(userDefn);
  },
});

/**
 * The Users update validated method.
 */
export const updateUserRoleMethod = new ValidatedMethod({
  name: 'Users.updateRole',
  validate: null,
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Users.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Users.');
    }
    return Users.updateRole(definition.userID, definition.newRole, definition.oldRole);
  },
});

/**
 * The Users update validated method.
 */
export const removeUserMethod = new ValidatedMethod({
  name: 'Users.removeIt',
  validate: null,
  run(remove) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Users.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Users.');
    }
    return Users.removeIt(remove.id);
  },
});
