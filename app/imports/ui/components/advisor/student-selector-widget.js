// import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Student_Selector_Widget.onCreated(function studentSelectorOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
  this.firstNameRegex = new ReactiveVar();
  this.lastNameRegex = new ReactiveVar();
  this.userNameRegex = new ReactiveVar();
});

Template.Student_Selector_Widget.helpers({
  firstNameRegex() {
    return Template.instance().firstNameRegex;
  },
  lastNameRegex() {
    return Template.instance().lastNameRegex;
  },
  userNameRegex() {
    return Template.instance().userNameRegex;
  },
});

Template.Student_Selector_Widget.events({
});
