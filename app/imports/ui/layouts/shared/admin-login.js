import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

/** @module ui/layouts/shared/UH_Login */

Template.Admin_Login.events({
  /**
   * Handle the click on the logout link.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .admin': function clickOpenModal(event) {
    event.preventDefault();
    $('.ui.modal').modal('show');
  },
});

// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.Admin_Login.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });
});
