import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  if (Meteor.isTest || Meteor.isAppTest) {
    process.env.MAIL_URL = 'Test MAIL_URL variable';
  } else {
    // Get MAIL_URL from settings file unless already available as an environment variable.
    process.env.MAIL_URL = process.env.MAIL_URL || Meteor.settings.env.MAIL_URL;
  }
});
