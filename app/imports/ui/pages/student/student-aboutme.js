import { Template } from 'meteor/templating';

Template.Student_AboutMe.helpers({
  getDictionary() {
    return Template.instance().state;
  },
});

Template.Student_AboutMe.events({
  // add your statement here
});

Template.Student_AboutMe.onCreated(function studentAboutMeOnCreated() {
  // add your statement here
});

Template.Student_AboutMe.onRendered(function studentAboutMeOnRendered() {
  // add your statement here
});

Template.Student_AboutMe.onDestroyed(function studentAboutMeOnDestroyed() {
  // add your statement here
});

