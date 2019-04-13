import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import * as FormUtils from '../form-fields/form-field-utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

const updateSchema = new SimpleSchema({
  choice: { type: String },
}, { tracker: Tracker });

Template.Update_Plan_Choice_Widget.onCreated(function updatePlanChoiceWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Plan_Choice_Widget.helpers({
  planChoice() {
    return PlanChoices.findDoc(Template.currentData().updateID.get());
  },
  falseValueRetired() {
    const plan = PlanChoices.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = PlanChoices.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Plan_Choice_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updateData);
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'PlanChoiceCollection', updateData }, (error) => {
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

Template.Update_Plan_Choice_Widget.onRendered(function updatePlanChoiceWidgetOnRendered() {
  // add your statement here
});

Template.Update_Plan_Choice_Widget.onDestroyed(function updatePlanChoiceWidgetOnDestroyed() {
  // add your statement here
});

