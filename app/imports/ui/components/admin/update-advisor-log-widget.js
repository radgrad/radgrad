import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from '../form-fields/form-field-utilities';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';

const updateSchema = new SimpleSchema({
  advisor: String,
  student: String,
  text: String,
}, { tracker: Tracker });

Template.Update_Advisor_Log_Widget.onCreated(function updateadvisorlogwidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Advisor_Log_Widget.helpers({
  advisorLog() {
    return AdvisorLogs.findDoc(Template.currentData().updateID.get());
  },
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

Template.Update_Advisor_Log_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: AdvisorLogs.getCollectionName(), updateData }, (error) => {
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

Template.Update_Advisor_Log_Widget.onRendered(function updateadvisorlogwidgetOnRendered() {
  // add your statement here
});

Template.Update_Advisor_Log_Widget.onDestroyed(function updateadvisorlogwidgetOnDestroyed() {
  // add your statement here
});

