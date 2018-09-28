import { Template } from 'meteor/templating';

Template.Role_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Role_Form_Field.helpers({
  isSelected(role, selectedRole) {
    return role === selectedRole;
  },
});
