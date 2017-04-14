import { Template } from 'meteor/templating';

Template.Advisor_Academic_Plan_Page.onRendered(function advisorAcademicPlanPageOnRendered() {
  Template.instance().$('.menu .item').tab();
});
