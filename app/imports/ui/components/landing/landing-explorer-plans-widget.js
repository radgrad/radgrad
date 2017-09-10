import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Landing_Explorer_Plans_Widget.onCreated(function studentExplorerPlansWidgetOnCreated() {
  this.planVar = new ReactiveVar();
});

Template.Landing_Explorer_Plans_Widget.helpers({
  toUpper(string) {
    return string.toUpperCase();
  },
  plans() {
    return AcademicPlans.find().fetch();
  },
  planVar() {
    return Template.instance().planVar;
  },
  plan() {
    return Template.instance().data.item;
  },
  selectedPlan() {
    return '';
  },
});

Template.Landing_Explorer_Plans_Widget.onRendered(function studentExplorerPlansWidgetOnRendered() {
  Template.instance().planVar.set(Template.instance().data.item);
});

Template.Landing_Explorer_Plans_Widget.onDestroyed(function studentExplorerPlansWidgetOnDestroyed() {
  // add your statement here
});

