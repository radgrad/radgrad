import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from '../form-fields/form-field-utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';

const updateSchema = new SimpleSchema({
  student: String,
  year: Number,
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Academic_Year_Instance_Widget.onCreated(function updateacademicyearinstancewidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Academic_Year_Instance_Widget.helpers({
  academicYearInstance() {
    return AcademicYearInstances.findDoc(Template.currentData().updateID.get());
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, student => Users.getFullName(student.username));
    return sorted;
  },
  falseValueRetired() {
    const plan = AcademicYearInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = AcademicYearInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Academic_Year_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    console.log('updateData=%o, valid=%o', updateData, instance.context.isValid());
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: AcademicYearInstances.getCollectionName(), updateData }, (error) => {
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

Template.Update_Academic_Year_Instance_Widget.onRendered(function updateacademicyearinstancewidgetOnRendered() {
  // add your statement here
});

Template.Update_Academic_Year_Instance_Widget.onDestroyed(function updateacademicyearinstancewidgetOnDestroyed() {
  // add your statement here
});
