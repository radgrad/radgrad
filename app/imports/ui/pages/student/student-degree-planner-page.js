import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Student_Degree_Planner_Page.onCreated(function plannerOnCreated() {
  this.state = new ReactiveDict();
});

Template.Student_Degree_Planner_Page.helpers({
  args() {
    const studentDoc = Users.findDoc({ username: FlowRouter.getParam('username') });
    if (studentDoc) {
      return {
        currentSemesterID: Semesters.getCurrentSemester(),
        studentUserName: studentDoc.username,
      };
    }
    return null;
  },
});
