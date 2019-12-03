import { Template } from 'meteor/templating';

Template.Input_Date_Form_Field.onRendered(function onRendered() {
  this.$(`#${this.data.name}`).calendar();
});
