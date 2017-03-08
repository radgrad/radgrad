import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

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

Template.Student_Degree_Planner_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Degree_Planner_Page.onCreated(function plannerOnCreated() {
  this.state = new ReactiveDict();
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_Degree_Planner_Page.onRendered(function plannerOnRendered() {
  // Accounts._loginButtonsSession.set('dropdownVisible', true);
});
