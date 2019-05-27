import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { starBulkLoadJsonDataMethod, testBulkLoadErrorMethod } from '../../../api/star/StarProcessor.methods';
import { getRouteUserName } from '../shared/route-user-name';
import { generateStudentEmailsMethod } from '../../../api/user/UserCollection.methods';
// import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

/* global FileReader */

// Must match the format in the server-side startup/server/fixtures.js


Template.Star_Bulk_Upload_Widget.onCreated(function starBulkUploadWidgetOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.result = new ReactiveVar('');
  this.starWorking = new ReactiveVar(false);
  this.emailWorking = new ReactiveVar(false);
});

Template.Star_Bulk_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  emailWorking() {
    return Template.instance().emailWorking.get();
  },
  starWorking() {
    return Template.instance().starWorking.get();
  },
  uploadResult() {
    return Template.instance().result.get();
  },
});

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

Template.Star_Bulk_Upload_Widget.events({
  'click .jsStarData': function clickJsStarData(event, instance) {
    event.preventDefault();
    instance.starWorking.set(true);
    const advisor = getRouteUserName();
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const starData = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        // console.log(advisor, jsonData);
        starBulkLoadJsonDataMethod.call({ advisor, jsonData }, (error, result) => {
          if (error) {
            console.log('Error loading bulk STAR data', error);
          }
          instance.result.set(result);
          instance.starWorking.set(false);
        });
        // updateAllStudentLevelsMethod.call((error) => {
        //   if (error) {
        //     console.log('Error updating all student levels', error);
        //   }
        // });
      };
      fr.readAsText(starData);
    }
  },
  'click .jsStudentEmails': function clickStudentEmails(event, instance) {
    event.preventDefault();
    instance.emailWorking.set(true);
    generateStudentEmailsMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during Generating Student Emails: ', error);
        instance.result.set(error);
        instance.successClass.set('error');
      } else {
        const data = {};
        data.name = 'Students';
        data.contents = result.students;
        const emails = result.students.join('\n');
        instance.result.set(emails);
        instance.successClass.set('success');
        const zip = new ZipZap();
        const now = moment().format(databaseFileDateFormat);
        const dir = `radgrad-students${now}`;
        const fileName = `${dir}/Students.txt`;
        zip.file(fileName, emails);
        zip.saveAs(`${dir}.zip`);
      }
      instance.emailWorking.set(false);
    });
  },
  'click .jsTestError': function clickTestError(event) {
    event.preventDefault();
    testBulkLoadErrorMethod.call('some random data', (error, result) => {
      console.log(error, result);
      console.log(`${error.message}\n${error.details}`);
    });
  },
});
