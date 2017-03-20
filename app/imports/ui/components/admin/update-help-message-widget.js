import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  routeName: { type: String, optional: false },
  title: { type: String, optional: false },
  text: { type: String, optional: false },
});

Template.Update_Help_Message_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Help_Message_Widget.helpers({
  helpMessage() {
    return HelpMessages.findDoc(Template.currentData().updateID.get());
  },
  routeNames() {
    // When doing an update, you cannot select a different routeName.
    return [HelpMessages.findDoc(Template.currentData().updateID.get()).routeName];
  },
});

Template.Update_Help_Message_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      HelpMessages.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
