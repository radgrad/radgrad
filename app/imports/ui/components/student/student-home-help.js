/**
 * Created by ataka on 10/30/16.
 */
import { Template } from 'meteor/templating';

Template.Student_Home_Help.events({
  // add your events here.
});

Template.Student_Home_Help.onCreated(function studentHomeHelOnCreated() {
  // add your statement here
});

Template.Student_Home_Help.onRendered(function studentHomeHelOnRendered() {
  this.$('.ui.accordion').accordion('close', 0);
});

Template.Student_Home_Help.onDestroyed(function studentHomeHelOnDestroyed() {
  // add your statement here
});

