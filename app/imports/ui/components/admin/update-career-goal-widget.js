import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from './form-fields/form-field-utilities.js';


const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

Template.Update_Career_Goal_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

// Template.Update_Career_Goal_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
//   this.$('.dropdown').dropdown({});
// });

Template.Update_Career_Goal_Widget.helpers({
  careerGoal() {
    return CareerGoals.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const careerGoal = CareerGoals.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(careerGoal.slugID).name;
  },
  // successClass() {
  //   return Template.instance().successClass.get();
  // },
  // errorClass() {
  //   return Template.instance().errorClass.get();
  // },
  // fieldError(fieldName) {
  //   const invalidKeys = Template.instance().context.invalidKeys();
  //   const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
  //   return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  // },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  selectedInterestIDs() {
    const careerGoal = CareerGoals.findDoc(Template.currentData().updateID.get());
    return careerGoal.interestIDs;
  },
});

Template.Update_Career_Goal_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    // const name = event.target.name.value;
    // const moreInformation = event.target.moreInformation.value;
    // const description = event.target.description.value;
    // // Get Interests (multiple selection)
    // const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    // const interestIDs = _.map(selectedInterests, (option) => option.value);
    // const updatedData = { name, moreInformation, description, interestIDs };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      CareerGoals.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
      // instance.successClass.set('success');
      // instance.errorClass.set('');
      // event.target.reset();
      // // instance.$('.dropdown').dropdown('clear');
      // instance.$('form').form('clear');
    } else {
      FormUtils.indicateError(instance);
      // instance.successClass.set('');
      // instance.errorClass.set('error');
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
