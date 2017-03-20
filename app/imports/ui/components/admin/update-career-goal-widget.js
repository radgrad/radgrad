import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

Template.Update_Career_Goal_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Career_Goal_Widget.helpers({
  careerGoal() {
    return CareerGoals.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const careerGoal = CareerGoals.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(careerGoal.slugID).name;
  },
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
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      CareerGoals.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
