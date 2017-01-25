// import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

Template.Advisor_Student_Configuration_Page.helpers({
  prevID() {
    return Template.instance().prevID;
  },
  studentID() {
    return Template.instance().studentID;
  },
  displayWidget() {
    const prevID = Template.instance().prevID.get();
    const currID = Template.instance().studentID.get();
    let ret = false;
    if (!prevID && currID) {
      // ret = true;
      Template.instance().prevID.set(currID);
    } else if (prevID === currID) {
      ret = true;
    } else if (prevID !== currID) {
      Template.instance().prevID.set(currID);
    }
    return ret;
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
  this.prevID = new ReactiveVar('');
});

Template.Advisor_Student_Configuration_Page.onRendered(function advisorStudentConfirgurationPageOnRendered() {

});
