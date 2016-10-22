import { Template } from 'meteor/templating';

Template.Warnings.helpers({
  warningArgs(warning) {
    return {
      warning,
    };
  },
});

Template.Warnings.events({
  // add your events here
});

Template.Warnings.onCreated(function () {
  // add your statement here
});

Template.Warnings.onRendered(function () {
  // add your statement here
});

Template.Warnings.onDestroyed(function () {
  // add your statement here
});

