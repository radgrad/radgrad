import { Template } from 'meteor/templating';
import { SemesterSnapshots } from '../../../api/semester/SemesterSnapshotCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

/* global alert */

Template.Semester_Snapshot_Widget.onCreated(function semesterSnapshotWidgetOnCreated() {
  this.subscribe(SemesterSnapshots.getPublicationName());
  const collectionName = SemesterSnapshots.getCollectionName();
  const definitionData = {};
  definitionData.term = 'Fall';
  definitionData.year = 2017;
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (error) {
      console.log('Error defining semester snapshot', error);
    } else {
      alert('Semester snapshot successful.');
    }
  });
});
