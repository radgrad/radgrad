import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { dumpDatabaseMethodName } from '../../../api/base/BaseCollection.methods.js';
import { restoreFileDateFormat } from '../../../api/test/fixture-utilities';

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
    Meteor.call(dumpDatabaseMethodName, null, (error, result) => {
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
        const fileName = `${dir}/${moment(result.timestamp).format(restoreFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  },
});
