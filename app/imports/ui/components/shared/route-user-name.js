import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.registerHelper('routeUserName', () => FlowRouter.getParam('username'));
