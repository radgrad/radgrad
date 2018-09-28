import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import * as FormUtils from '../form-fields/form-field-utilities';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';

const addSchema = new SimpleSchema({
  advisor: String,
  student: String,
  text: String,
}, { tracker: Tracker });

Template.Add_Advisor_Log_Widget.onCreated(function addadvisorlogwidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Advisor_Log_Widget.helpers({
  advisors() {
    const advisors = Roles.getUsersInRole([ROLE.ADVISOR]).fetch();
    const sorted = _.sortBy(advisors, advisor => Users.getFullName(advisor.username));
    return sorted;
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, student => Users.getFullName(student.username));
    return sorted;
  },
});

Template.Add_Advisor_Log_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    // console.log(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: AdvisorLogs.getCollectionName(), definitionData: newData }, (error) => {
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
