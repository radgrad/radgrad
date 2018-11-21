import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import * as FormUtils from '../form-fields/form-field-utilities';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const updateSchema = new SimpleSchema({
  term: String,
  year: Number,
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Semester_Widget.onCreated(function updateSemesterWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Semester_Widget.helpers({
  semester() {
    return Semesters.findDoc(Template.currentData().updateID.get());
  },
  falseValueRetired() {
    const semester = Semesters.findDoc(Template.currentData()
      .updateID
      .get());
    return !semester.retired;
  },
  trueValueRetired() {
    const semester = Semesters.findDoc(Template.currentData()
      .updateID
      .get());
    return semester.retired;
  },

});

Template.Update_Semester_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    if (updateData.retired === 'true') {
      updateData.retired = true;
    } else {
      updateData.retired = false;
    }
    instance.context.validate(updateData);
    // console.log(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: Semesters.getCollectionName(), updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      console.log(`Error ${instance.context._validationErrors}`);
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

Template.Update_Semester_Widget.onRendered(function updateSemesterWidgetOnRendered() {
  // add your statement here
});

Template.Update_Semester_Widget.onDestroyed(function updateSemesterWidgetOnDestroyed() {
  // add your statement here
});

