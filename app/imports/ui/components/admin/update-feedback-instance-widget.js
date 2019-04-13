import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  user: String,
  functionName: String,
  description: String,
  feedbackType: String,
}, { tracker: Tracker });

Template.Update_Feedback_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Feedback_Instance_Widget.helpers({
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
  },
  feedbackInstance() {
    const fi = FeedbackInstances.findDoc(Template.currentData().updateID.get());
    return fi;
  },
  feedbackTypes() {
    return FeedbackInstances.feedbackTypes;
  },
  falseValueRetired() {
    const plan = FeedbackInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = FeedbackInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Feedback_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: FeedbackInstances.getCollectionName(), updateData }, (error) => {
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
