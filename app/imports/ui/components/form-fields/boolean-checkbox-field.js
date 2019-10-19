import { Template } from 'meteor/templating';

Template.Boolean_Checkbox_Field.onCreated(function booleanCheckboxFieldOnCreated() {
});

Template.Boolean_Checkbox_Field.helpers({
  // add your helpers here
});

Template.Boolean_Checkbox_Field.events({
  // add your events here
});

Template.Boolean_Checkbox_Field.onRendered(function booleanCheckboxFieldOnRendered() {
  const template = this;
  template.$('.ui .checkbox')
    .checkbox();
});

Template.Boolean_Checkbox_Field.onDestroyed(function booleanCheckboxFieldOnDestroyed() {
  // add your statement here
});
