import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  user: String,
  description: String,
  functionName: String,
  feedbackType: String,
}, { tracker: Tracker });

Template.Add_Feedback_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Feedback_Instance_Widget.helpers({
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, student => Users.getFullName(student.username));
    return sorted;
  },
  feedbackTypes() {
    return FeedbackInstances.feedbackTypes;
  },
});

Template.Add_Feedback_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid() &&
        !FeedbackInstances.isFeedbackInstance(newData.user, newData.functionName, newData.feedbackType)) {
      defineMethod.call({ collectionName: FeedbackInstances.getCollectionName(), definitionData: newData }, (error) => {
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
