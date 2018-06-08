import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  company: { type: String, optional: true },
  career: { type: String, optional: true },
  location: { type: String, optional: true },
  linkedin: { type: String, optional: true },
  motivation: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_User_Widget_Mentor.onCreated(function addUserWidgetMentorOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Update_User_Widget_Mentor.helpers({
  // add your helpers here
});

Template.Update_User_Widget_Mentor.events({
  // add your events here
});

Template.Update_User_Widget_Mentor.onRendered(function addUserWidgetMentorOnRendered() {
  // add your statement here
});

Template.Update_User_Widget_Mentor.onDestroyed(function addUserWidgetMentorOnDestroyed() {
  // add your statement here
});

