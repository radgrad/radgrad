import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';

const updateSchema = new SimpleSchema({
  name: String,
  description: String,
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Opportunity_Type_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Opportunity_Type_Widget.helpers({
  opportunity() {
    return OpportunityTypes.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const opportunity = OpportunityTypes.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(opportunity.slugID).name;
  },
  falseValueRetired() {
    const plan = OpportunityTypes.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = OpportunityTypes.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Opportunity_Type_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: OpportunityTypes.getCollectionName(), updateData }, (error) => {
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
