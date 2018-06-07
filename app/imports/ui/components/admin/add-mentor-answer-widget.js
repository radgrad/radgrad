import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import * as FormUtils from './form-fields/form-field-utilities';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const addSchema = new SimpleSchema({
  user: String,
  question: String,
  text: String,
}, { tracker: Tracker });

Template.Add_Mentor_Answer_Widget.onCreated(function addMentorAnswerWidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Mentor_Answer_Widget.helpers({
  mentors() {
    const mentors = Roles.getUsersInRole([ROLE.MENTOR]).fetch();
    const sorted = _.sortBy(mentors, 'lastName');
    return sorted;
  },
  questions() {
    const questions = MentorQuestions.find({}, { sort: { question: 1 } }).fetch();
    return questions;
  },
});

Template.Add_Mentor_Answer_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid() &&
      !MentorAnswers.isMentorAnswer(newData.question, newData.user)) {
      FormUtils.renameKey(newData, 'user', 'mentor');
      defineMethod.call({ collectionName: 'MentorQuestionCollection', definitionData: newData }, (error) => {
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
