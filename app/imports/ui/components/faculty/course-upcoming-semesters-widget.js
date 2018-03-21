import { Template } from 'meteor/templating';

Template.Course_Upcoming_Semesters_Widget.onCreated(function courseUpcommingSemestersWidgetOnCreated() {
  console.log(this.data);
});

Template.Course_Upcoming_Semesters_Widget.helpers({
  semesters() {
    return Template.instance().data.semesters;
  },
  courseName() {
    const course = Template.instance().data.course;
    return course.number;
  },
  course() {
    return Template.instance().data.course;
  }
});

Template.Course_Upcoming_Semesters_Widget.events({
  // add your events here
});

Template.Course_Upcoming_Semesters_Widget.onRendered(function courseUpcommingSemestersWidgetOnRendered() {
  // add your statement here
});

Template.Course_Upcoming_Semesters_Widget.onDestroyed(function courseUpcommingSemestersWidgetOnDestroyed() {
  // add your statement here
});

