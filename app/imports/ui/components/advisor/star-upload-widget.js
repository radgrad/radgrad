import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { updateLevelMethod } from '../../../api/level/LevelProcessor.methods';
import { starLoadDataMethod } from '../../../api/star/StarProcessor.methods';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
/* global FileReader */
// /** @module ui/components/advisor/Star_Upload_Widget */

const updateSchema = new SimpleSchema({
  firstName: { type: String, optional: false },
  lastName: { type: String, optional: false },
  slug: { type: String, optional: false }, // will rename this to username
  role: { type: String, optional: false },
  email: { type: String, optional: false },
  uhID: { type: String, optional: false },
  // remaining are optional.
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: [String], optional: true },
  interests: { type: [String], optional: true },
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
      const student = Users.findDoc(instance.data.studentID.get());
      const advisor = getRouteUserName();
      const fileName = event.target.parentElement.getElementsByTagName('input')[0];
      if (fileName.files && fileName.files[0]) {
        const starData = fileName.files[0];
        const fr = new FileReader();
        fr.onload = (e) => {
          const csvData = e.target.result;
          starLoadDataMethod.call({ advisor, student: student.username, csvData }, (error) => {
            if (error) {
              console.log('Error loading STAR data', error);
            }
          });
          updateLevelMethod.call({ studentID: student._id }, (error) => {
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
