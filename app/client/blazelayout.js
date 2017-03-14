import { BlazeLayout } from 'meteor/kadira:blaze-layout';

/**
 * Override default rendering of layouts (DOM element with id __blaze-root) to
 * render layouts into the body.
 * Used to ensure secondary menu for mobile is stuctured correctly.
 */
BlazeLayout.setRoot('body');
