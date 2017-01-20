import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from './route-user-name';

export function getUserIdFromRoute() {
  const username = getRouteUserName();
  return Users.findDoc({ username })._id;
}
