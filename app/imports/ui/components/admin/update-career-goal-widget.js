import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  description: { type: String, optional: false },
  interestIDs: { type: [String], optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

Template.Update_Career_Goal_Widget.onCreated(function onCreated() {
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.context = updateSchema.namedContext('update_Widget');
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Update_Career_Goal_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
  this.$('.dropdown').dropdown({});
});

Template.Update_Career_Goal_Widget.helpers({
  careerGoal() {
    return CareerGoals.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const careerGoal = CareerGoals.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(careerGoal.slugID).name;
  },
  successClass() {
    return Template.instance().successClass.get();
  },
  errorClass() {
    return Template.instance().errorClass.get();
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  interestSelected(interest) {
    const careerGoal = CareerGoals.findDoc(Template.currentData().updateID.get());
    return _.indexOf(careerGoal.interestIDs, interest._id) !== -1;
  },
});

Template.Update_Career_Goal_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const name = event.target.name.value;
    const moreInformation = event.target.moreInformation.value;
    const description = event.target.description.value;
    // Get Interests (multiple selection)
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interestIDs = _.map(selectedInterests, (option) => option.value);
    const updatedData = { name, moreInformation, description, interestIDs };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that data reflects what will be inserted.
    updateSchema.clean(updatedData);
    // Determine validity.
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      CareerGoals.update(instance.data.updateID.get(), { $set: updatedData });
      instance.successClass.set('success');
      instance.errorClass.set('');
      event.target.reset();
    } else {
      instance.successClass.set('');
      instance.errorClass.set('error');
    }
  },
  'click .jsCancel': function (event, instance) {
    event.preventDefault();
    instance.data.updateID.set('');
  },
});
