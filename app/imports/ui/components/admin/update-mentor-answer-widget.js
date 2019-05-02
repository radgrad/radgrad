import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

const updateSchema = new SimpleSchema({
  mentor: String,
  question: String,
  text: String,
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Mentor_Answer_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Mentor_Answer_Widget.helpers({
  mentors() {
    const mentors = Roles.getUsersInRole([ROLE.MENTOR]).fetch();
    const sorted = _.sortBy(mentors, 'lastName');
    return sorted;
  },
  mentorAnswer() {
    const ma = MentorAnswers.findDoc(Template.currentData().updateID.get());
    return ma;
  },
  questions() {
    const questions = MentorQuestions.find({}, { sort: { question: 1 } }).fetch();
    return questions;
  },
  falseValueRetired() {
    const plan = MentorAnswers.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = MentorAnswers.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Mentor_Answer_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      // FormUtils.renameKey(updateData, 'user', 'mentor');
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'MentorAnswerCollection', updateData }, (error) => {
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
