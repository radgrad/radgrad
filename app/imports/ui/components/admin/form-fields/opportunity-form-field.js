import { Template } from 'meteor/templating';

Template.Opportunity_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Opportunity_Form_Field.helpers({
  isSelected(opportunity, selectedOpportunity) {
    return opportunity === selectedOpportunity;
  },
});
