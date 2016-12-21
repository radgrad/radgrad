import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

Template.Add_Career_Goal_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

const careerGoalSchema = new SimpleSchema({
  name: {
    type: String,
    optional: false,
    max: 200,
  },
  slug: {
    type: String,
    optional: false,
    max: 200,
  },
  description: {
    type: String,
    optional: false,
    max: 200,
  },
  interests: {
    type: String,
    optional: false,
    max: 200,
  },
  moreInformation: {
    type: String,
    optional: false,
    max: 200,
  },
});

const displayErrorMessages = 'displayErrorMessages';
const displayAddWidget = 'displayAddWidget';
const displayEditWidget = 'displayEditWidget';

Template.Add_Career_Goal_Widget.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.messageFlags.set(displayAddWidget, false);
  this.messageFlags.set(displayEditWidget, false);
  this.context = careerGoalSchema.namedContext('Add_Career_Goal_Widget');
});

Template.Add_Career_Goal_Widget.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayAddWidget() {
    return Template.instance().messageFlags.get(displayAddWidget);
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
});