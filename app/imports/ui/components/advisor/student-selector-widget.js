// import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
//
Template.Student_Selector_Widget.onCreated(function studentSelectorOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
});

Template.Student_Selector_Widget.events({
  'click .jsFindStudent': function (event, instance) {
    event.preventDefault();
    const studentName = event.target.parentElement.getElementsByTagName('input')[0].value;
    const profile = Users.getProfile(studentName);
    if (profile) {
      instance.studentID.set(studentName);
    } else {
      console.log(`${studentName} is not in RadGrad.`);
    }
  },
});
