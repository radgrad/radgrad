import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Advisor_Student_Configuration_Page.onCreated(function advisorStudentConfigurationPageOnCreated() {
  this.state = new ReactiveDict();
  this.studentID = new ReactiveVar('');
  this.prevID = new ReactiveVar('');
});

Template.Advisor_Student_Configuration_Page.helpers({
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
  studentID() {
    return Template.instance().studentID;
  },
  getDictionary() {
    return Template.instance().state;
  },
});
