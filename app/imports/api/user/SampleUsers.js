import { Users } from '/imports/api/user/UserCollection';
import { ROLE } from '/imports/api/role/Role';
import { moment } from 'meteor/momentjs:moment';

/** @module SampleUsers */

/**
 * Creates a User with a unique slug and unique email and returns its docID.
 * If role is not supplied, it defaults to ROLE.STUDENT.
 * @returns { String } The docID of the newly generated User.
 */
export function makeSampleUser(role = ROLE.STUDENT) {
  const firstName = 'Joe';
  const lastName = 'User';
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `user-${uniqueString}`;
  const email = `joeuser${uniqueString}@hawaii.edu`;
  const password = 'foo';
  return Users.define({ firstName, lastName, slug, email, role, password });
}
