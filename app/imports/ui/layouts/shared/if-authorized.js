import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection';
import { getGroupName } from '../../components/shared/route-group-name';

/* eslint-disable object-shorthand */

Template.If_Authorized.onCreated(function ifAuthorizedOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.If_Authorized.helpers({
  /**
   * @returns {*} True if Meteor is in the process of logging in.
   * @memberOf ui/layouts/shared
   */
  authInProcess: function authInProcess() {
    return Meteor.loggingIn();
  },

  /**
   * Determine if the user is authorized to view the current page.
   * If current page is the landing page, they are authorized.
   * If current user is an admin, they can see any page.
   * If current user is an advisor, they can see any student, alumni, or advisor page.
   * If current user is a student, they can see only their own page (student/<username>/).
   * If current user is a mentor, they can see only their own page (mentor/<username>).
   * If current user is an alumni, they can see only their own page (alumni/<username>).
   * @returns {boolean} True if there is a logged in user and they are authorized to visit the page.
   * @memberOf ui/layouts/shared
   */
  isAuthorized: function isAuthorized() {
    // console.log('running isAuthorized');

    // 1. If landing page, then everyone is authorized.
    const currPath = FlowRouter.current().path;
    if (currPath && currPath === '/') {
      // console.log('isAuthorized', 'landing');
      return true;
    }
    // 2. If not landing page, then prohibit non-logged in clients.
    if (!Meteor.user(true)) {
      // console.log('isAuthorized', 'not logged in');
      return false;
    }
    // 3. Determine the user and role specified in the URL.
    const pathUserName = FlowRouter.getParam('username');
    const pathRole = getGroupName();
    // Determine the user and role who is logged in right now.
    const userName = Meteor.user('username').username;
    const userRole = Meteor.user('roles').roles[0];
    // console.log('isAuthorized', pathUserName, pathRole, userName, userRole);

    // 4. Make sure the URL is correctly constructed; that the user associated with pageUserName actually has
    // the role specified in pageRole. i.e. no http://radgrad.ics.hawaii.edu/student/johnson
    const urlUserNameData = Meteor.users.findOne({ username: pathUserName });
    if (!urlUserNameData || urlUserNameData.roles[0].toLowerCase() !== pathRole) {
      // console.log('isAuthorized', `${pathRole}/${pathUserName} not valid.`);
      return false;
    }

    // 5. Allow admins to go to any page.
    if (userRole === ROLE.ADMIN) {
      // console.log('isAuthorized', 'admin');
      return true;
    }

    // 6. Allow advisors to see any student, alumni, or advisor page.
    if (userRole === ROLE.ADVISOR && (pathRole === 'student' || pathRole === 'alumni' || pathRole === 'advisor')) {
      // console.log('isAuthorized', 'advisor');
      return true;
    }

    // 7. Allow alumni, faculty, mentors, students to only see their own page.
    if ((pathRole === 'alumni' || pathRole === 'faculty' || pathRole === 'mentor' || pathRole === 'student')
        && (pathUserName === userName) && (pathRole === userRole.toLowerCase())) {
      // console.log('isAuthorized', 'alumni, faculty, mentor, student');
      return true;
    }

    // 8. Otherwise don't allow access.
    // console.log('isAuthorized', 'default deny');
    return false;
  },
  notLoggedIn() {
    return !Meteor.user(true);
  },
});
