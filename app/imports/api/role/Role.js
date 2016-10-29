/** @module Role */

/** Defines the legal strings used to represent roles in the system. */

import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';

/**
 * ROLE Provides ROLE.FACULTY, ROLE.STUDENT, ROLE.ADMIN, ROLE.ALUMNI.
 * @type { Object }
 */
export const ROLE = { FACULTY: 'FACULTY', STUDENT: 'STUDENT', ADMIN: 'ADMIN', ALUMNI: 'ALUMNI' };

/**
 * Predicate for determining if a string is a defined ROLE.
 * @param { String } role The role.
 * @returns {boolean} True if role is a defined ROLE.
 */
export function isRole(role) {
  return (typeof role) === 'string' && _.includes(_.values(ROLE), role);
}

/**
 * Ensures that role is a valid role.
 * @param role The role.
 * @throws { Meteor.Error } If role is not a valid role.
 */
export function assertRole(role) {
  if (!isRole(role)) {
    throw new Meteor.Error(`${role} is not a defined role.`);
  }
}

// Initialize Roles to ROLENAMES by deleting all existing roles, then defining just those in ROLENAMES.

if (Meteor.isServer) {
  if (Roles.getAllRoles().count() !== 4) {
    Roles.getAllRoles().fetch().map(role => Roles.deleteRole(role.name));
    _.values(ROLE).map(role => Roles.createRole(role));
  }
}
