import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  if (Meteor.isTest || Meteor.isAppTest) {
    process.env.MAIL_URL = 'Test MAIL_URL variable';
  } else {
    process.env.MAIL_URL = Meteor.settings.env.MAIL_URL;
  }
});
