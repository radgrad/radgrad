import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { dumpDatabaseMethod, dumpAppLogMethod, clearAppLogMethod } from '../../../api/base/BaseCollection.methods.js';
import { loadFileDateFormat } from '../../../api/test/test-utilities';

Template.Admin_DataBase_Dump_Page.helpers({
  errorMessage() {
    return Template.instance().successOrError.get() === 'error' ? Template.instance().results.get() : '';
  },
  hidden() {
    const data = Template.instance().results.get();
    return (data) ? '' : 'hidden';
  },
  results() {
    return Template.instance().results.get() || '';
  },
  successOrError() {
    return Template.instance().successOrError.get();
  },
  timestamp() {
    return moment(Template.instance().timestamp.get()).format('MMMM Do YYYY, H:mm:ss a');
  },
  totalEntries() {
    return _.reduce(Template.instance().results.get(), function (sum, collection) {
      return sum + collection.contents.length;
    }, 0);
  },
});

Template.Admin_DataBase_Dump_Page.onCreated(function onCreated() {
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
  this.timestamp = new ReactiveVar();
});

// Must match the format in the server-side startup/server/initialize-db.js


Template.Admin_DataBase_Dump_Page.events({
  'click .jsDumpDB': function clickEvent(event, instance) {
    event.preventDefault();
    dumpDatabaseMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during Database Dump: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      } else {
        instance.results.set(result.collections);
        instance.timestamp.set(result.timestamp);
        instance.successOrError.set('success');
        const zip = new ZipZap();
        const dir = 'radgrad-db';
        const fileName = `${dir}/${moment(result.timestamp).format(loadFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  },
  'click .jsDumpLog': function clickDumpLog(event, instance) {
    event.preventDefault();
    dumpAppLogMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during Log Dump: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      } else {
        instance.results.set(result.applicationLog);
        instance.timestamp.set(result.timestamp);
        instance.successOrError.set('success');
        const zip = new ZipZap();
        const dir = 'radgrad-log';
        const fileName = `${dir}/${moment(result.timestamp).format(loadFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  },
  'click .jsClearLog': function clickDumpLog(event, instance) {
    event.preventDefault();
    clearAppLogMethod.call(null, (error) => {
      if (error) {
        console.log('Error during clearing Log: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      }
      instance.successOrError.set('success');
    });
  },
});
