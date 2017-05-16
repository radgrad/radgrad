import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

/** @module ui/components/shared/RouteUserName */

/**
 * Returns the username portion of the route.
 * Returns the username for all routes except the landing page.
 */
export function getRouteUserName() {
  return FlowRouter.getParam('username');
}

/**
 * Provide getRouteUserName as a global helper called routeUserName.
 */
Template.registerHelper('routeUserName', () => getRouteUserName());
