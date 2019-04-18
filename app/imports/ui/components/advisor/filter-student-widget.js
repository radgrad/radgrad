import { Template } from 'meteor/templating';

Template.Filter_Student_Widget.onCreated(function filterStudentWidgetOnCreated() {
  // console.log('Filter_Student_Widget data=%o', this.data);
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
  'click .jsClear': function handleClear(event, instance) {
    event.preventDefault();
    const inputs = event.target.parentElement.getElementsByTagName('input');
    // console.log('handleClear inputs=%o', inputs);
    inputs[0].value = '';
    inputs[1].value = '';
    inputs[2].value = '';
    instance.firstNameRegex.set('.*');
    instance.lastNameRegex.set('.*');
    instance.userNameRegex.set('.*');
  },
  'keyup input': function handleChange(event, instance) {
    event.preventDefault();
    // console.log('handleChange(%o, %o)', event.target.parentElement.parentElement, instance);
    const inputs = instance.firstNode.getElementsByTagName('input');
    // console.log(inputs);
    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const userName = inputs[2].value;
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
