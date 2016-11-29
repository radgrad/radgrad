import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Fourth_Menu.helpers({
  isCurrentPage: function currentPage(routeName) {
    return FlowRouter.getRouteName() === routeName;
  },
});
