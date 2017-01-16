import { Template } from 'meteor/templating';

Template.Student_Home_AboutMe_Page.helpers({
  getDictionary() {
    return Template.instance().state;
  },
});

Template.Student_Home_AboutMe_Page.events({
  // add your statement here
});

Template.Student_Home_AboutMe_Page.onCreated(function studentHomeAboutMePageOnCreated() {
  // add your statement here
});

Template.Student_Home_AboutMe_Page.onRendered(function studentHomeAboutMePageOnRendered() {
  // add your statement here
});

Template.Student_Home_AboutMe_Page.onDestroyed(function studentHomeAboutMePageOnDestroyed() {
  // add your statement here
});

