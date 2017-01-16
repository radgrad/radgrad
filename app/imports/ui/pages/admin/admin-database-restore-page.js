import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { restoreDatabaseMethodName } from '../../../api/base/BaseCollectionMethods.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { restoreFileDateFormat } from '/imports/ui/pages/admin/admin-database-dump-page.js';
import { moment } from 'meteor/momentjs:moment';

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
  restoreDate() {
    // Assumes file name is like: private/database/mockup/2017-01-12-02-59-12.json
    // Split the file name into terms separated by / or ., then pick the second to last term as the date.
    const fileName = Meteor.settings.public.databaseRestoreFileName;
    const terms = _.words(fileName, /[^/. ]+/g);
    const dateString = terms[terms.length - 2];
    return moment(dateString, restoreFileDateFormat).fromNow();
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
