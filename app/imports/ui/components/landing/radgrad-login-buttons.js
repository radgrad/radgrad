import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { getStudentProfileMethod } from '../../../api/user/StudentProfileCollection.methods';

/* global alert */

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
        const { username } = Meteor.user('username');
        if (!username) {
          alert('You must use only lower case letters in your username.');
          Meteor.logout();
        }
        const id = Meteor.userId();
        let role = Roles.getRolesForUser(id)[0];
        const studentp = role.toLowerCase() === 'student';
        if (studentp) {
          getStudentProfileMethod.call(username, (err, result) => {
            if (err) {
              console.error('Failed to get profile', error);
            } else {
              if (result.isAlumni) {
                role = 'Alumni';
              }
              FlowRouter.go(`/${role.toLowerCase()}/${username}/home`);
            }
          });
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
