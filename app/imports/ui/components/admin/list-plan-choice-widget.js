import { Template } from 'meteor/templating';
import * as FormUtils from '../form-fields/form-field-utilities';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

Template.List_Plan_Choice_Widget.helpers({
  count() {
    return PlanChoices.find().count();
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(planChoice) {
    return [
      { label: 'Choice', value: planChoice.choice },
    ];
  },
  name(pc) {
    return pc.choice;
  },
  planChoices() {
    return PlanChoices.find().fetch();
  },
});

Template.List_Plan_Choice_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'PlanChoiceCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

Template.List_Plan_Choice_Widget.onRendered(function listPlanChoiceWidgetOnRendered() {
  // add your statement here
});

Template.List_Plan_Choice_Widget.onDestroyed(function listPlanChoiceWidgetOnDestroyed() {
  // add your statement here
});

