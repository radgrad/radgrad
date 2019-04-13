import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  name: String,
  description: String,
}, { tracker: Tracker });

Template.Update_Interest_Type_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Interest_Type_Widget.helpers({
  interest() {
    return InterestTypes.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const interest = InterestTypes.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(interest.slugID).name;
  },
  falseValueRetired() {
    const plan = InterestTypes.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = InterestTypes.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Interest_Type_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: InterestTypes.getCollectionName(), updateData }, (error) => {
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
