import { Template } from 'meteor/templating';
import { upComingSemesters } from '../../../api/semester/SemesterUtilities';

Template.Course_Scoreboard_Page.onCreated(function courseScoreboardPageOnCreated() {
  // add your statement here
});

Template.Course_Scoreboard_Page.helpers({
  upComingSemesters() {
    const semesters = upComingSemesters();
    return semesters;
  },
  needRow(index) {
    return index % 3 === 0;
  },
});

Template.Course_Scoreboard_Page.events({
  // add your events here
});

Template.Course_Scoreboard_Page.onRendered(function courseScoreboardPageOnRendered() {
  // add your statement here
});

Template.Course_Scoreboard_Page.onDestroyed(function courseScoreboardPageOnDestroyed() {
  // add your statement here
});

