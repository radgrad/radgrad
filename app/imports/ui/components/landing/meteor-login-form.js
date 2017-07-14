import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

Template.Meteor_Login_Form.events({

  submit(event) {
    event.preventDefault();
    console.log('after submit', event, event.target['username'], event.target.password);
  },
});
