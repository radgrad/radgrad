import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { restoreDatabaseMethodName } from '../../../api/base/BaseCollectionMethods.js';

Template.Admin_DataBase_Restore_Page.helpers({
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
  restoreFile() {
    return Meteor.settings.public.databaseRestoreFileName;
  },
});

Template.Admin_DataBase_Restore_Page.onCreated(function onCreated() {
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
});

Template.Admin_DataBase_Restore_Page.events({
  'click .jsRestoreDB': function clickEvent(event, instance) {
    event.preventDefault();
    Meteor.call(restoreDatabaseMethodName, null, (error, result) => {
      if (error) {
        console.log('Error during Database Restore: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      } else {
        instance.results.set(result);
        instance.successOrError.set('success');
      }
    });
  },
});
