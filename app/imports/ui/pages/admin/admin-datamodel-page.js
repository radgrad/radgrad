import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { loadFixtureMethod } from '../../../api/base/BaseCollection.methods';

/* global FileReader */

Template.Admin_DataModel_Page.onCreated(function adminDatamodelPageOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.result = new ReactiveVar('');
  this.working = new ReactiveVar(false);
});

Template.Admin_DataModel_Page.helpers({
  currentUpload() {
    return Template.instance()
      .currentUpload
      .get();
  },
  uploadResult() {
    return Template.instance()
      .result
      .get();
  },
  working() {
    return Template.instance().working.get();
  },
});

Template.Admin_DataModel_Page.events({
  'click .jsFixture': function clickJsStarData(event, instance) {
    event.preventDefault();
    instance.working.set(true);
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const starData = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        loadFixtureMethod.call(jsonData, (error, result) => {
          if (error) {
            console.log('Error loading fixture', error);
          }
          instance.result.set(result);
          instance.working.set(false);
        });
      };
      fr.readAsText(starData);
    }
  },
});

Template.Admin_DataModel_Page.onRendered(function adminDatamodelPageOnRendered() {
  // add your statement here
});

Template.Admin_DataModel_Page.onDestroyed(function adminDatamodelPageOnDestroyed() {
  // add your statement here
});
