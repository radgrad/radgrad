import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import * as FormUtils from '../form-fields/form-field-utilities';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const addSchema = new SimpleSchema({
  choice: { type: String, custom: FormUtils.slugFieldValidator },
}, { tracker: Tracker });

Template.Add_Plan_Choice_Widget.onCreated(function addPlanChoiceWidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Plan_Choice_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'PlanChoiceCollection', definitionData: newData }, (error) => {
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
});
