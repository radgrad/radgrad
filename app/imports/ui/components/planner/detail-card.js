import { Template } from 'meteor/templating';

Template.Detail_Card.helpers({
  // ad
});

Template.Detail_Card.events({
  // add your events here
});

Template.Detail_Card.onCreated(function () {
  // add your statement here
});

Template.Detail_Card.onRendered(function () {
  console.log(this.data);
});

Template.Detail_Card.onDestroyed(function () {
  // add your statement here
});

