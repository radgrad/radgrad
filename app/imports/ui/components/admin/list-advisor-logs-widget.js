import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities';

Template.List_Advisor_Logs_Widget.helpers({
  advisorLogs() {
    return AdvisorLogs.find({}, { sort: { createdOn: 1 } });
  },
  count() {
    return AdvisorLogs.count();
  },
  name(advisorLog) {
    return `${Users.getFullName(advisorLog.studentID)} ${advisorLog.createdOn}`;
  },
  descriptionPairs(advisorLog) {
    return [
      { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
      { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
      { label: 'Text', value: advisorLog.text },
    ];
  },
});

Template.List_Advisor_Logs_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: AdvisorLogs.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
