import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { moment } from 'meteor/momentjs:moment';
import { ROLE } from '../../../api/role/Role';
import * as FormUtils from '../form-fields/form-field-utilities';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const addSchema = new SimpleSchema({
  question: String,
  user: String,
  slug: String,
  moderated: Boolean,
  visible: Boolean,
  moderatorComments: String,
}, { tracker: Tracker });

Template.Add_Mentor_Question_Widget.onCreated(function addMentorQuestionWidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Mentor_Question_Widget.helpers({
  students() {
    const mentors = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(mentors, 'lastName');
    return sorted;
  },
});

Template.Add_Mentor_Question_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(newData, 'user', 'student');
      newData.slug = `${newData.student}${moment().format('YYYYMMDDHHmmssSSSSS')}`;

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
