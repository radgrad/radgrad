import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  name: String,
  description: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
}, { tracker: Tracker });

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
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'CareerGoalCollection', updateData }, (error) => {
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
