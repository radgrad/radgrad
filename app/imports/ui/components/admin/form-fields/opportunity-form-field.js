import { Template } from 'meteor/templating';

Template.Opportunity_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Opportunity_Form_Field.helpers({
  isSelected(opportunity, selectedOpportunity) {
    return opportunity === selectedOpportunity;
  },
  id(opportunity){
    if (opportunity._id){
      return opportunity._id;
    } else {
      return null;
    }
  },
  name(opportunity) {
    if (opportunity.name) {
      return opportunity.name;
    } else {
      return 'NONE';
    }
  },
});
