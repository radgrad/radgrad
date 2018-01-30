import { Template } from 'meteor/templating';
import { upComingSemesters } from '../../../api/semester/SemesterUtilities';

Template.Advisor_Course_Scoreboard_Page.helpers({
  upComingSemesters() {
    const semesters = upComingSemesters();
    return semesters;
  },
  needRow(index) {
    return index % 3 === 0;
  },
});
