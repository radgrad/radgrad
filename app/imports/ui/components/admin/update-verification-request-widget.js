import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import * as FormUtils from '../form-fields/form-field-utilities';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const updateSchema = new SimpleSchema({
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Verification_Request_Widget.onCreated(function updateVerificationRequestWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Verification_Request_Widget.helpers({
  item() {
    return VerificationRequests.findDoc(Template.currentData().updateID.get());
  },
  name(vr) {
    const student = Users.getFullName(vr.studentID);
    const oi = OpportunityInstances.findDoc(vr.opportunityInstanceID);
    const semester = Semesters.toString(oi.semesterID, false);
    const opportunityName = OpportunityInstances.getOpportunityDoc(vr.opportunityInstanceID).name;
    return `${student}: ${opportunityName} - ${semester}`;
  },
  falseValueRetired() {
    const plan = VerificationRequests.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = VerificationRequests.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Verification_Request_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: VerificationRequests.getCollectionName(), updateData }, (error) => {
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

Template.Update_Verification_Request_Widget.onRendered(function updateVerificationRequestWidgetOnRendered() {
  // add your statement here
});

Template.Update_Verification_Request_Widget.onDestroyed(function updateVerificationRequestWidgetOnDestroyed() {
  // add your statement here
});

