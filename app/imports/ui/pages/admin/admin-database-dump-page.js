import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataBase_Dump_Page.helpers({
  results() {
    return Template.instance().results.get() || '';
  },
  hidden() {
    const data = Template.instance().results.get();
    return (data) ? '' : 'hidden';
  },
  successOrError() {
    return Template.instance().successOrError.get();
  },
});

Template.Admin_DataBase_Dump_Page.onCreated(function onCreated() {
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
});

Template.Admin_DataBase_Dump_Page.events({
  'click .jsDumpDB': function clickEvent(event, instance) {
    event.preventDefault();
    Meteor.call('DumpDatabase', null, (error, result) => {
      if (error) {
        console.log('Error during Database Dump: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      } else {
        instance.results.set(result);
        instance.successOrError.set('success');
      }
    });
  },
});
