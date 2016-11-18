Template.Second_Menu.helpers({
  isCurrentPage: function(routeName) {
    return FlowRouter.getRouteName() == routeName;
  }
});