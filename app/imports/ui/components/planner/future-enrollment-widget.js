import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';

Template.Future_Enrollment_Widget.onCreated(function futureEnrollmentWidgetOnCreated() {
  this.state = this.data.dictionary;
});

Template.Future_Enrollment_Widget.helpers({
  dataToString(index) {
    if (index < 0 || index > 8) {
      return '';
    }
    const data = Template.instance().state.get(plannerKeys.plannedEnrollment);
    if (data) {
      const enrollment = data.enrollmentData[index];
      return `${enrollment[0]}(${enrollment[1]}) `;
    }
    return '';
  },
});

Template.Future_Enrollment_Widget.events({
  // add your events here
});

Template.Future_Enrollment_Widget.onRendered(function futureEnrollmentWidgetOnRendered() {
  // add your statement here
});

Template.Future_Enrollment_Widget.onDestroyed(function futureEnrollmentWidgetOnDestroyed() {
  // add your statement here
});

