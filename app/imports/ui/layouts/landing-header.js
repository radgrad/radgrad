
import { Template } from 'meteor/templating';

Template.Landing_Header.helpers({
  josephineICE() {
    return { i: 100, c: 100, e: 100 };
  },
  brianICE() {
    return { i: 100, c: 95, e: 99 };
  },
  micheleICE() {
    return { i: 98, c: 100, e: 94 };
  },
  aljonICE() {
    return { i: 100, c: 99, e: 99 };
  },
  kelsieICE() {
    return { i: 96, c: 100, e: 100 };
  },
  syICE() {
    return { i: 95, c: 97, e: 100 };
  },
});

Template.Landing_Header.events({
  // add your events here
});

Template.Landing_Header.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Header.onRendered(function landingBodyOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Landing_Header.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});

