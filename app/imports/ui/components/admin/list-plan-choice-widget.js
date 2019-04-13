import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from '../form-fields/form-field-utilities';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

Template.List_Plan_Choice_Widget.onCreated(function listPlanChoicesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

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
      { label: 'Retired', value: planChoice.retired ? 'True' : 'False' },
    ];
  },
  name(pc) {
    return pc.choice;
  },
  planChoices() {
    const items = PlanChoices.find().fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return PlanChoices;
  },
  retired(item) {
    return item.retired;
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

