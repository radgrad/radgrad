/**
 * Created by Cam Moore on 12/22/16.
 */

import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection';

export function getStudents() {
  const users = Users.find({}, { sort: { lastName: 1 } }).fetch();
  const students = [];
  _.map(users, (user) => {
    if (Roles.userIsInRole(user._id, ROLE.STUDENT)) {
      students.push(user);
    }
  });
  return students;
}

export const NUM_TOP_MENU_ITEMS = 10;
export const SUBMENU_ITEM_COUNT = 2;
export const counter = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
