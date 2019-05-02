import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const updateSchema = new SimpleSchema({
  question: String,
  student: String,
  slug: String,
  moderated: String,
  visible: String,
  moderatorComments: { type: String, optional: true },
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Mentor_Question_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Mentor_Question_Widget.helpers({
  students() {
    const mentors = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(mentors, 'lastName');
    return sorted;
  },
  mentorQuestion() {
    const ma = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return ma;
  },
  questions() {
    const questions = MentorQuestions.find({}, { sort: { question: 1 } }).fetch();
    return questions;
  },
  slug() {
    const mentorQuestion = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(mentorQuestion.slugID).name;
  },
  trueValueModerated() {
    const course = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return course.moderated;
  },
  falseValueModerated() {
    const course = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return !course.moderated;
  },
  trueValueVisible() {
    const course = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return course.visible;
  },
  falseValueVisible() {
    const course = MentorQuestions.findDoc(Template.currentData().updateID.get());
    return !course.visible;
  },
  falseValueRetired() {
    const plan = MentorQuestions.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = MentorQuestions.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Mentor_Question_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      // FormUtils.renameKey(updateData, 'user', 'student');
      updateData.moderated = (updateData.moderated === 'true');
      updateData.visible = (updateData.visible === 'true');
      updateData.id = instance.data.updateID.get();
      if (!_.has(updateData, 'moderatorComments')) {
        updateData.moderatorComments = ' ';
      }
      updateMethod.call({ collectionName: 'MentorQuestionCollection', updateData }, (error) => {
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
