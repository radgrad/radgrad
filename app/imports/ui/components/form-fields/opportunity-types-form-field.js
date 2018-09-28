import { Template } from 'meteor/templating';

Template.Opportunity_Types_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Opportunity_Types_Form_Field.helpers({
  isSelected(opportunityType, selectedOpportunityType) {
    return opportunityType === selectedOpportunityType;
  },
});
