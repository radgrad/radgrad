import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

Template.Meteor_Login_Form.events({

  submit(event) {
    event.preventDefault();
    console.log('after submit', event.target.username.value, event.target.password.value);
    const username = event.target.username.value;
    const password = event.target.password.value;
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.log('error during login');
      } else {
        $('.ui.modal').modal('hide');
      }
    });
  },

  'click .cancel-login-form': function cancel(event) {
    event.preventDefault();
    $('.ui.modal').modal('hide');
  },

});
