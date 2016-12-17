import { Template } from 'meteor/templating';

Template.Add_Career_Goal_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

