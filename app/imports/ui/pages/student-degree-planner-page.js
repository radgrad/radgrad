import { Template } from 'meteor/templating';
import { Courses } from '../../api/course/CourseCollection.js';

Template.Student_Degree_Planner_Page.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
  });
});

Template.Student_Degree_Planner_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Student_Degree_Planner_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
