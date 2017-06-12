import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Help_Message_Widget */

const updateSchema = new SimpleSchema({
  routeName: String,
  title: String,
  text: String,
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
});

Template.Update_Help_Message_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'HelpMessageCollection', updateData }, (error) => {
        if (error) {
          console.log('update error', error);
          FormUtils.indicateError(instance);
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
