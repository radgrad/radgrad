import { Template } from 'meteor/templating';

Template.Filter_Student_Widget.onCreated(function filterStudentWidgetOnCreated() {
  this.firstNameRegex = this.data.firstNameRegex;
  this.lastNameRegex = this.data.lastNameRegex;
  this.userNameRegex = this.data.userNameRegex;
});

Template.Filter_Student_Widget.helpers({
  label() {
    return Template.instance().data.label;
  },
});

Template.Filter_Student_Widget.events({
  // add your events here
  'click .jsFilter': function (event, instance) {
    event.preventDefault();
    const firstName = event.target.parentElement.getElementsByTagName('input')[0].value;
    const lastName = event.target.parentElement.getElementsByTagName('input')[1].value;
    const userName = event.target.parentElement.getElementsByTagName('input')[2].value;
    if (firstName) {
      // console.log(`Have firstName ${firstName}`);
      instance.firstNameRegex.set(firstName);
    } else {
      instance.firstNameRegex.set('.*');
    }
    if (lastName) {
      // console.log(`Have lastName ${lastName}`);
      instance.lastNameRegex.set(lastName);
    } else {
      instance.lastNameRegex.set('.*');
    }
    if (userName) {
      // console.log(`Have userName ${userName}`);
      instance.userNameRegex.set(userName);
    } else {
      instance.userNameRegex.set('.*');
    }
  },
});
