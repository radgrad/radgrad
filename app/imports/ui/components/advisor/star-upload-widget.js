/* global FileReader */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
// import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StarDataLogs } from '../../../api/star/StarDataLogCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

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

Template.Star_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  starLogs() {
    if (Template.currentData().studentID.get()) {
      const studentID = Template.currentData().studentID.get();
      return StarDataLogs.find({ studentID });
    }
    return null;
  },
});

Template.Star_Upload_Widget.events({
  'click .jsStarData': function clickJsStarData(event, instance) {
    event.preventDefault();
    if (instance.data.studentID.get()) {
      // const studentID = instance.data.studentID.get();
      const student = Users.findDoc(instance.data.studentID.get());
      const fileName = event.target.parentElement.getElementsByTagName('input')[0];
      if (fileName.files && fileName.files[0]) {
        const starData = fileName.files[0];
        const fr = new FileReader();
        fr.onload = (e) => {
          const csvData = e.target.result;
          Meteor.call('StarProcessor.loadStarCsvData', student.username, csvData);
          Meteor.call('LevelProcessor.updateLevel', { studentID: student._id });
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

Template.Star_Upload_Widget.onCreated(function starUploadWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.currentUpload = new ReactiveVar(false);
  this.subscribe(Courses.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(StarDataLogs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(5), this.data.studentID.get());
    this.subscribe(OpportunityInstances.getPublicationName(3), this.data.studentID.get());
  });
});

Template.Star_Upload_Widget.onRendered(function starUploadWidgetOnRendered() {
  // add your statement here
});

Template.Star_Upload_Widget.onDestroyed(function starUploadWidgetOnDestroyed() {
  // add your statement here
});

