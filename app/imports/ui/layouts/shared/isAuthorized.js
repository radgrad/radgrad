import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ROLE } from '../../../api/role/Role';

/**
 * Determine if the current user is authorized to see the requested page contents.
 * If current user is an admin, they can see any page.
 * If current user is an advisor, they can see any student, mentor, and advisor pages.
 * If current user is a student, they can see only their own page (student/<username>/).
 * If current user is a mentor, they can see only their own page (mentor/<username>).
 */
Template.registerHelper('isAuthorized', () => {
  // URL info
  const urlUserName = FlowRouter.getParam('username');
  const urlRole = FlowRouter.current().route.group.name;
  // Logged in user info
  const userName = Meteor.user().username;
  const userRole = Roles.getRolesForUser(Meteor.userId())[0];
  // console.log(Meteor.users.find().fetch());

  // Make sure the URL is correctly constructed; that the user associated with pageUserName actually has
  // the role specified in pageRole.
  const urlUserNameData = Meteor.user.findOne({ username: urlUserName });
  if (!urlUserNameData || urlUserNameData.roles[0].toLowerCase() !== urlRole) {
    console.log(`${urlUserName} or ${urlRole} not valid.`);
    return false;
  }

  return true;
});
