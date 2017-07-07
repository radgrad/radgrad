import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from './route-user-name';

/** @module ui/components/shared/GetUserIDFromRoute */

/**
 * Returns the userID from the route to the current page.
 */
export function getUserIdFromRoute() {
  const username = getRouteUserName();
  return username && Users.getID(username);
}
