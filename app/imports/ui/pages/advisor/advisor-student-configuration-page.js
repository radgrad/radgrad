// import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

Template.Advisor_Student_Configuration_Page.helpers({
  studentID() {
    return Template.instance().studentID;
  },
  getDictionary() {
    return Template.instance().state;
  },
});

Template.Advisor_Student_Configuration_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Advisor_Student_Configuration_Page.onCreated(function advisorStudentConfirgurationPageOnCreated() {
  this.state = new ReactiveDict();
  this.studentID = new ReactiveVar('');
});

Template.Advisor_Student_Configuration_Page.onRendered(function advisorStudentConfirgurationPageOnRendered() {

});
