import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

/** @module ui/layouts/shared/UH_Login */

Template.Admin_Login.events({
  /**
   * Handle the click on the logout link.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .admin': function clickOpenModal(event) {
    event.preventDefault();
    console.log('in clickOpenModel');
    $('.ui.modal').modal('show');
  },
});

// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.Admin_Login.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });
});
