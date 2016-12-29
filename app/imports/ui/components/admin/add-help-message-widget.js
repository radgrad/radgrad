import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { routeNames } from '../../../startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

const addSchema = new SimpleSchema({
  routeName: { type: String, optional: false },
  title: { type: String, optional: false },
  text: { type: String, optional: false },
});

Template.Add_Help_Message_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.subscribe(HelpMessages.getPublicationName());
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
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      HelpMessages.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
