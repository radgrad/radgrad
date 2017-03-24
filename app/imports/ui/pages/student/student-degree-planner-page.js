import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';

Template.Student_Degree_Planner_Page.onCreated(function plannerOnCreated() {
  this.state = new ReactiveDict();
});

Template.Student_Degree_Planner_Page.helpers({
  args() {
    return {
      currentSemester: Semesters.getCurrentSemesterDoc(),
    };
  },
});
