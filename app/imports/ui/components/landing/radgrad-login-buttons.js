import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Users } from '../../../api/user/UserCollection';

Template.RadGrad_Login_Buttons.events({

  /**
   * Handle the .cas-login click event.
   * @param event The click event.
   * @returns {boolean} False.
   * @memberOf ui/components/landing
   */
  'click .cas-login': function casLogin(event, instance) {
    event.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        console.log('Error during CAS Login: ', error);
        instance.$('div .ui.error.message.hidden').text('You are not yet registered. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        let username = Meteor.user('username').username;
        if (!username) {
          const profileName = Meteor.user().profile.name.toLowerCase();
          username = `${profileName}@hawaii.edu`;
        }
        const profile = Users.findProfileFromUsername(username);
        const id = Meteor.userId();
        let role = Roles.getRolesForUser(id)[0];
        console.log(Meteor.user(), username, id, role, profile);
        console.log(Users.findProfileFromUsername('johnson@hawaii.edu'));
        const studentp = role.toLowerCase() === 'student';
        if (studentp) {
          if (profile && profile.isAlumni) {
            role = 'Alumni';
          } else if (!profile) {
            console.error(`${username} is not a defined user.`);
          }
        }
        FlowRouter.go(`/${role.toLowerCase()}/${username}/home`);
      }
    };
    Meteor.loginWithCas(callback);
    return false;
  },

  /**
   * Handle the .meteor-login click event,
   * @param event The click event.
   * @returns {boolean} False.
   * @memberOf ui/components/landing
   */
  'click .meteor-login': function clickOpenModal(event) {
    event.preventDefault();
    $('.ui.modal').modal('show');
  },
});


// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.RadGrad_Login_Buttons.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });

  this.$('.modal').modal({
    onApprove: function foo(event) {
      console.log('approved', event, event.target);
    },
  });
});
