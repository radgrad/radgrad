import { Template } from 'meteor/templating';

Template.Add_Course_Item.helpers({
  whenScheduled(course) {
    return 'Every semester';
  },
});

Template.Add_Course_Item.events({
  // add your events here
});

Template.Add_Course_Item.onCreated(function () {
  // add your statement here
});

Template.Add_Course_Item.onRendered(function () {
  this.$('.ui.accordion')
      .accordion()
  ;
});

Template.Add_Course_Item.onDestroyed(function () {
  // add your statement here
});

