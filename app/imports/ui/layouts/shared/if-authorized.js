import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '../../../api/user/UserCollection';

/* eslint-disable object-shorthand */

Template.If_Authorized.onCreated(function ifAuthorizedOnCreated() {
  this.autorun(() => {
    this.subscribe(Users.getPublicationName());
  });
});

Template.If_Authorized.helpers({
  /**
   * @returns {*} True if Meteor is in the process of logging in.
   */
  authInProcess: function authInProcess() {
    return Meteor.loggingIn();
  },

  /**
   * Determine if the user is authorized to view the current page.
   * If current page is the landing page, they are authorized.
   * If current user is an admin, they can see any page.
   * If current user is an advisor, they can see any student, mentor, and advisor pages.
   * If current user is a student, they can see only their own page (student/<username>/).
   * If current user is a mentor, they can see only their own page (mentor/<username>).
   * @returns {boolean} True if there is a logged in user and they are authorized to visit the page.
   */
  isAuthorized: function isAuthorized() {
    console.log('running isAuthorized');
    // If landing page, then everyone is authorized.
    const currPath = FlowRouter.current().path;
    if (currPath && currPath === '/') {
      return true;
    }
    // If not landing page, then prohibit non-logged in clients.
    if (!Meteor.user()) {
      return false;
    }
    // Determine the user and role specified in the URL.
    const pathUserName = FlowRouter.getParam('username');
    const pathRole = FlowRouter.current().route.group.name;
    // Determine the user and role who is logged in right now.
    const userName = Meteor.user().username;
    const userRole = Meteor.user().roles;
    console.log(pathUserName, pathRole, userName, userRole);

    // Make sure the URL is correctly constructed; that the user associated with pageUserName actually has
    // the role specified in pageRole. i.e. no student/johnson
    const urlUserNameData = Meteor.users.findOne({ username: pathUserName });
    if (!urlUserNameData || urlUserNameData.roles[0].toLowerCase() !== pathRole) {
      console.log(`${pathRole}/${pathUserName} not valid.`);
      return false;
    }

    return true;
  },
});
