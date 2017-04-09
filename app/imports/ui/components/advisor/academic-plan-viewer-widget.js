import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Academic_Plan_Viewer_Widget.onCreated(function academicPlanViewerWidgetOnCreated() {
  if (this.data) {
    this.plan = this.data.plan;
  }
});

Template.Academic_Plan_Viewer_Widget.helpers({
  degreeName() {
    return DesiredDegrees.findDoc(Template.instance().plan.degreeID).shortName;
  },
  fallYear() {
    const effectiveSemester = Semesters.findDoc(Template.instance().plan.effectiveSemesterID);
    return effectiveSemester.year;
  },
  springYear() {
    const effectiveSemester = Semesters.findDoc(Template.instance().plan.effectiveSemesterID);
    return effectiveSemester.year + 1;
  },
  years() {
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  },
});

Template.Academic_Plan_Viewer_Widget.events({
  // add your events here
});

Template.Academic_Plan_Viewer_Widget.onRendered(function academicPlanViewerWidgetOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Viewer_Widget.onDestroyed(function academicPlanViewerWidgetOnDestroyed() {
  // add your statement here
});

