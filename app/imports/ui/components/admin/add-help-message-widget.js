import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { routeNames } from '../../../startup/client/router.js';

// /** @module ui/components/admin/Add_Help_Message_Widget */

const addSchema = new SimpleSchema({
  routeName: String,
  title: String,
  text: String,
}, { tracker: Tracker });

Template.Add_Help_Message_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Help_Message_Widget.helpers({
  routeNames() {
    // When defining a new help message, only provide routeNames that are not already used in a help message.
    const routesWithHelp = HelpMessages.find().map(doc => doc.routeName);
    return _.without(routeNames, ...routesWithHelp);
  },
});

Template.Add_Help_Message_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'HelpMessageCollection', definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);  // TODO have a way of setting the FormUtils error text.
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
