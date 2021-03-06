import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  routeName: String,
  title: String,
  text: String,
  retired: Boolean,
}, { tracker: Tracker });

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
  falseValueRetired() {
    const plan = HelpMessages.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = HelpMessages.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Help_Message_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'HelpMessageCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
