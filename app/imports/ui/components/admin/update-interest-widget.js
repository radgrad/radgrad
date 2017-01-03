import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  description: { type: String, optional: false },
  interestType: { type: String, optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

Template.Update_Interest_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(InterestTypes.getPublicationName());
});

Template.Update_Interest_Widget.helpers({
  interest() {
    return Interests.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const interest = Interests.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(interest.slugID).name;
  },
  interestTypes() {
    return InterestTypes.find({}, { sort: { name: 1 } });
  },
});

Template.Update_Interest_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      Interests.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
