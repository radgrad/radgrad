import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { updateLevelMethod } from '../../../api/level/LevelProcessor.methods';
import { starLoadDataMethod } from '../../../api/star/StarProcessor.methods';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';
import * as FormUtils from '../form-fields/form-field-utilities.js';

/* global FileReader */

const updateSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  slug: String, // will rename this to username
  role: String,
  email: String,
  uhID: String,
  // remaining are optional.
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: Array, minCount: 1 }, 'careerGoals.$': String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  website: { type: String, optional: true },
});

Template.Star_Upload_Widget.onCreated(function starUploadWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.currentUpload = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe(CourseInstances.publicationNames.studentID, this.data.studentID.get());
    this.subscribe(OpportunityInstances.publicationNames.studentID, this.data.studentID.get());
  });
});

Template.Star_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
});

Template.Star_Upload_Widget.events({
  'click .jsStarData': function clickJsStarData(event, instance) {
    event.preventDefault();
    if (instance.data.studentID.get()) {
      // const studentID = instance.data.studentID.get();
      const profile = Users.getProfile(instance.data.studentID.get());
      const advisor = getRouteUserName();
      const fileName = event.target.parentElement.getElementsByTagName('input')[0];
      if (fileName.files && fileName.files[0]) {
        const starData = fileName.files[0];
        const fr = new FileReader();
        fr.onload = (e) => {
          const csvData = e.target.result;
          starLoadDataMethod.call({ advisor, student: profile.username, csvData }, (error) => {
            if (error) {
              console.log('Error loading STAR data', error);
            }
          });
          updateLevelMethod.call({ studentID: profile.userID }, (error) => {
            if (error) {
              console.log('Error updating student level', error);
            }
          });
        };
        fr.readAsText(starData);
      }
      // FeedbackFunctions.checkPrerequisites(studentID);
      // FeedbackFunctions.checkCompletePlan(studentID);
      // FeedbackFunctions.generateRecommendedCourse(studentID);
      // FeedbackFunctions.checkOverloadedSemesters(studentID);
      // FeedbackFunctions.generateNextLevelRecommendation(studentID);
    }
  },
});
