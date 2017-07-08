import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '../../api/user/UserCollection.js';

/**
 * Returns the explorerUserName portion of the route.
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.findDoc({ username })._id;
}

