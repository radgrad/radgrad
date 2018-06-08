import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { dumpDatabaseMethod } from '../../../api/base/BaseCollection.methods.js';
import { generateStudentEmailsMethod } from '../../../api/user/UserCollection.methods';

Template.Admin_DataBase_Dump_Page.helpers({
  errorMessage() {
    return Template.instance().successOrError.get() === 'error' ? Template.instance().results.get() : '';
  },
  hidden() {
    const data = Template.instance().results.get();
    return (data) ? '' : 'hidden';
  },
  haveResults() {
    console.log(!_.isNil(Template.instance().results.get()));
    return !_.isNil(Template.instance().results.get());
  },
  results() {
    return Template.instance().results.get() || '';
  },
  students() {
    console.log('students', Template.instance().students.get());
    return Template.instance().students.get() || '';
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
  this.students = new ReactiveVar();
  this.successOrError = new ReactiveVar();
  this.timestamp = new ReactiveVar();
});

// Must match the format in the server-side startup/server/fixtures.js
export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

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
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  },
  'click .jsStudentEmails': function clickStudentEmails(event, instance) {
    event.preventDefault();
    generateStudentEmailsMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during Generating Student Emails: ', error);
        instance.results.set(error);
        instance.successOrError.set('error');
      } else {
        const data = {};
        data.name = 'Students';
        data.contents = result.students;
        instance.results.set([data]);
        instance.timestamp.set(new Date());
        instance.successOrError.set('success');
        const zip = new ZipZap();
        const now = moment().format(databaseFileDateFormat);
        const dir = `radgrad-students${now}`;
        const fileName = `${dir}/Students.txt`;
        zip.file(fileName, result.students.join('\n'));
        zip.saveAs(`${dir}.zip`);
      }
    })
  }
});
