import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

const updateSchema = new SimpleSchema({
  name: String,
  shortName: { type: String, optional: true },
  description: String,
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Desired_Degree_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Desired_Degree_Widget.helpers({
  desiredDegree() {
    return DesiredDegrees.findDoc(Template.currentData()
      .updateID
      .get());
  },
  slug() {
    const degree = DesiredDegrees.findDoc(Template.currentData()
      .updateID
      .get());
    return Slugs.findDoc(degree.slugID).name;
  },
  falseValueRetired() {
    const degree = DesiredDegrees.findDoc(Template.currentData()
      .updateID
      .get());
    return !degree.retired;
  },
  trueValueRetired() {
    const degree = DesiredDegrees.findDoc(Template.currentData()
      .updateID
      .get());
    return degree.retired;
  },
});

Template.Update_Desired_Degree_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: DesiredDegrees.getCollectionName(), updateData }, (error) => {
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
