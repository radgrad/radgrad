import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { starBulkLoadDataMethod } from '../../../api/star/StarProcessor.methods';
import { getRouteUserName } from '../shared/route-user-name';
// import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

/* global FileReader */

Template.Star_Bulk_Upload_Widget.onCreated(function starBulkUploadWidgetOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
});

Template.Star_Bulk_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
});

Template.Star_Bulk_Upload_Widget.events({
  'click .jsStarData': function clickJsStarData(event) {
    event.preventDefault();
    const advisor = getRouteUserName();
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const starData = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        const csvData = e.target.result;
        // console.log(advisor, csvData);
        starBulkLoadDataMethod.call({ advisor, csvData }, (error) => {
          if (error) {
            console.log('Error loading bulk STAR data', error);
          }
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
});
