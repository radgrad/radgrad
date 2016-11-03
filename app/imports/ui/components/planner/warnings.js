import { Template } from 'meteor/templating';

Template.Warnings.helpers({
  warningArgs(warning) {
    return {
      warning,
    };
  },
  warnings() {
    return [
      { text: 'Required course ICS 212 does not appear in your degree plan.' },
      { text: 'Fall 2017 appears overloaded with coursework and job responsibilities.' },
      { text: 'Your plan includes ICS 451 in Fall 2017, but it is unlikely to occur then.' },
    ];
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

