import { Template } from 'meteor/templating';

Template.Boolean_Form_Field.onRendered(function booleanFormFieldOnRendered() {
  const template = this;
  template.$('.ui.radio.checkbox')
      .checkbox();
});
