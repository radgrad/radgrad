import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { dumpDatabaseMethodName } from '../../../api/base/BaseCollectionMethods.js';
import { moment } from 'meteor/momentjs:moment';


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
  timestamp() {
    return moment().format('MMMM Do YYYY, H:mm:ss a');
  },
  errorMessage() {
    return Template.instance().successOrError.get() === 'error' ? Template.instance().results.get() : '';
  },
});

Template.Admin_DataBase_Dump_Page.onCreated(function onCreated() {
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
});

Template.Admin_DataBase_Dump_Page.events({
  'click .jsDumpDB': function clickEvent(event, instance) {
    event.preventDefault();
    Meteor.call(dumpDatabaseMethodName, null, (error, result) => {
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
