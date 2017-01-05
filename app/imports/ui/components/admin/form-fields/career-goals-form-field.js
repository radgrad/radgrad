import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Career_Goals_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Career_Goals_Form_Field.helpers({
  isSelected(careerGoalID, selectedcareerGoalIDs) {
    return _.includes(selectedcareerGoalIDs, careerGoalID);
  },
});
