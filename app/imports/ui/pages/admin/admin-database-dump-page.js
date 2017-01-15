import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { dumpDatabaseMethodName } from '../../../api/base/BaseCollectionMethods.js';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { _ } from 'meteor/erasaur:meteor-lodash';

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
    return moment(Template.instance().timestamp.get()).format('MMMM Do YYYY, H:mm:ss a');
  },
  errorMessage() {
    return Template.instance().successOrError.get() === 'error' ? Template.instance().results.get() : '';
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

export const restoreFileDateFormat = 'YYYY-MM-DD-hh-mm-ss';

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
