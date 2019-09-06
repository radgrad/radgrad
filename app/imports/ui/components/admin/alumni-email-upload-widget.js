import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { alumniEmailsMethod } from '../../../api/base/BaseCollection.methods';

/* global FileReader */

Template.Alumni_Email_Upload_Widget.onCreated(function alumniEmailUploadWidgetOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.result = new ReactiveVar('');
  this.starWorking = new ReactiveVar(false);
});

Template.Alumni_Email_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  starWorking() {
    return Template.instance().starWorking.get();
  },
  uploadResult() {
    return Template.instance().result.get();
  },
});

Template.Alumni_Email_Upload_Widget.events({
  'click .jsAlumniEmails': function clickAlumniEmails(event, instance) {
    event.preventDefault();
    instance.starWorking.set(true);
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const alumniEmailFilename = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        console.log(e.target.result);
        alumniEmailsMethod.call(e.target.result, (error, result) => {
          if (error) {
            console.error('Failed to load alumni emails', error);
          } else {
            console.log(result);
          }
          instance.result.set(result);
          instance.starWorking.set(false);
        });
      };
      fr.readAsText(alumniEmailFilename);
    }
  },
});

Template.Alumni_Email_Upload_Widget.onRendered(function alumniEmailUploadWidgetOnRendered() {
  // add your statement here
});

Template.Alumni_Email_Upload_Widget.onDestroyed(function alumniEmailUploadWidgetOnDestroyed() {
  // add your statement here
});

