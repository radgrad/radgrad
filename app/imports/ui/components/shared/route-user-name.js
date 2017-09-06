import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

/**
 * Returns the username portion of the route.
 * Returns the username for all routes except the landing page.
 * @memberOf ui/components/shared
 */
export function getRouteUserName() {
  // FlowRouter does url-encoding on paths, but has a bug so that '@' gets replaced with '%2540'.
  // The following line de-url-encodes the path so that the route username is the appropriate string.
  // I don't know how to disable url-encoding in FlowRouter.
  // Most folks appear to be switching to react router.
  const routeName = FlowRouter.getParam('username') && FlowRouter.getParam('username').replace('%2540', '@');
  return routeName;
}

/**
 * Provide getRouteUserName as a global helper called routeUserName.
 * @memberOf ui/components/shared
 */
Template.registerHelper('routeUserName', () => getRouteUserName());
